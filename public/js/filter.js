// document.addEventListener('DOMContentLoaded', function () {
//     const buttons = document.querySelectorAll('.rounded-button');
//     buttons.forEach(button => {
//         button.addEventListener('click', function () {
//             const form = this.closest('form');
//             const hiddenInput = form.querySelector('[name="q"]');
//             hiddenInput.value = this.value;
//             form.submit();
//         });
//     });
// });

    document.addEventListener('DOMContentLoaded', function () {
        const customSelect = document.querySelector('.custom-select');
        const selectItems = document.querySelector('.select-items');
        const filterValueInput = document.getElementById('filterValue');

        customSelect.addEventListener('click', function () {
            selectItems.style.display = (selectItems.style.display === 'block') ? 'none' : 'block';
        });

        const selectItemElements = document.querySelectorAll('.select-item');
        selectItemElements.forEach(item => {
            item.addEventListener('click', function () {
                const selectedValue = this.getAttribute('data-value');
                filterValueInput.value = selectedValue;
                customSelect.querySelector('.select-selected').innerHTML = this.innerHTML;
                selectItems.style.display = 'none';
            });
        });
    });

