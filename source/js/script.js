const tabs = document.querySelectorAll('.nation__tab');
const tabsContent = document.querySelectorAll('.nation__discription');
// const menuButton = document.querySelector('.nav__toggle');
// const menu = document.querySelector('.nav__list');

// menuButton.addEventListener('click', (evt) => {
//     evt.preventDefault();
//     menu.classList.toggle('nav__list--open');
// })

const getContent = (arr, i) => {
	arr.forEach(item => {
		item.forEach(i => {
            i.classList.remove('nation__discription--active')
        })
		item[i].classList.add('nation__discription--active')
	})
}

for (let i = 0; i < tabs.length; i++) {
	tabs[i].addEventListener('click', (evt) => {
        evt.preventDefault();
		getContent([tabs, tabsContent], i)
	})
}