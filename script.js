        if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('PWA движок успешно запущен!'))
        .catch(err => console.log('Ошибка запуска PWA:', err));
}

let deferredPrompt;
const pwaBanner = document.getElementById('pwa-banner');
const btnInstall = document.getElementById('btn-pwa-install');
const btnClose = document.getElementById('btn-pwa-close');

// Браузер понял, что сайт можно установить, и прислал событие
window.addEventListener('beforeinstallprompt', (e) => {
    // Не даем браузеру показать свое дефолтное всплывающее окно
    e.preventDefault();
    // Сохраняем событие, чтобы запустить его позже по клику на нашу кнопку
    deferredPrompt = e;
    // Показываем наш стильный кофейный баннер
    if (pwaBanner) {
        pwaBanner.style.setProperty('display', 'flex', 'important');
    }
});

// Логика клика по кнопке "Установить" в баннере
if (btnInstall) {
    btnInstall.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        // Показываем системное окно установки
        deferredPrompt.prompt();
        // Ждем, что выберет пользователь
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Пользователь выбрал: ${outcome}`);
        // Сбрасываем переменную, ее можно использовать только один раз
        deferredPrompt = null;
        // Прячем баннер
        if (pwaBanner) pwaBanner.style.display = 'none';
    });
}

// Логика кнопки закрытия баннера (крестик)
if (btnClose) {
    btnClose.addEventListener('click', () => {
        if (pwaBanner) pwaBanner.style.display = 'none';
    });
}


        document.addEventListener('DOMContentLoaded', () => {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const pagContainer = document.querySelector('.pagination-container');
            const pagButtons = document.querySelectorAll('.pag-btn[data-page]');
            const cards = document.querySelectorAll('.product-card');

            let currentCategory = 'all';
            let currentPage = 1;
            const itemsPerPage = 4; // Сколько товаров показывать на одной странице

            // Функция, которая фильтрует и распределяет по страницам одновременно
            function updateCatalog() {
                // 1. Сначала отбираем товары, которые подходят под выбранную категорию
                const filteredCards = Array.from(cards).filter(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (currentCategory === 'all') return true;
                    if (currentCategory === 'coffee' && cardCategory === 'coffee') return true;
                    if (currentCategory === 'gifts' && cardCategory === 'gifts') return true;
                    if (currentCategory === 'services' && cardCategory === 'services') return true;
                    return false;
                });

                // 2. Скрываем вообще все карточки и убираем анимацию
                cards.forEach(card => {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                });

                // 3. Считаем индексы для пагинации внутри отфильтрованных товаров
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const cardsToDisplay = filteredCards.slice(startIndex, endIndex);

                // 4. Показываем нужные карточки с плавным эффектом проявления
                cardsToDisplay.forEach((card, index) => {
                    card.style.display = 'flex';
                    // Небольшая задержка, чтобы карточки появлялись по очереди (эффект волны)
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });

                // 5. Управляем видимостью круглых кнопок 1, 2, 3 внизу
                // Если товаров в категории мало (меньше 4), прячем нижние цифры вообще
                if (filteredCards.length <= itemsPerPage) {
                    pagContainer.style.display = 'none';
                } else {
                    pagContainer.style.display = 'flex';
                }
            }

                        // Логика кликов по табам (Все, Кофе, Подарки, Услуга)
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Переключаем активную кнопку сверху
                    document.querySelector('.tab-btn.active').classList.remove('active');
                    button.classList.add('active');

                    // Принудительно приводим весь текст к нижнему регистру для проверки
                    const text = button.textContent.trim().toLowerCase();

                    if (text === 'все') currentCategory = 'all';
                    else if (text === 'кофе') currentCategory = 'coffee';
                    else if (text === 'подарки') currentCategory = 'gifts';
                    else if (text === 'услуга') currentCategory = 'services';

                    // Сбрасываем страницу на 1-ю
                    currentPage = 1;

                    // Защита: проверяем, существует ли активная кнопка пагинации перед удалением класса
                    const activePag = document.querySelector('.pag-btn.active');
                    if (activePag) activePag.classList.remove('active');

                    const firstPageBtn = document.querySelector('.pag-btn[data-page="1"]');
                    if (firstPageBtn) firstPageBtn.classList.add('active');

                    updateCatalog();
                });
            });


            // Логика кликов по кнопкам страниц (1, 2, 3 внизу)
            pagButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelector('.pag-btn.active').classList.remove('active');
                    btn.classList.add('active');

                    currentPage = parseInt(btn.getAttribute('data-page'));
                    updateCatalog();

                    // Плавно скроллим экран обратно к началу каталога при переключении страниц
                    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
                });
            });

            // Стрелочки влево/вправо (простой перенос страниц)
            document.getElementById('prev-page').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    document.querySelector('.pag-btn.active').classList.remove('active');
                    document.querySelector(`.pag-btn[data-page="${currentPage}"]`).classList.add('active');
                    updateCatalog();
                }
            });

            document.getElementById('next-page').addEventListener('click', () => {
                const totalVisiblePages = currentCategory === 'all' ? 3 : 1; // Упрощенно для видео
                if (currentPage < totalVisiblePages) {
                    currentPage++;
                    document.querySelector('.pag-btn.active').classList.remove('active');
                    document.querySelector(`.pag-btn[data-page="${currentPage}"]`).classList.add('active');
                    updateCatalog();
                }
            });

            // Запускаем каталог в первый раз при загрузке страницы
            updateCatalog();
        });


