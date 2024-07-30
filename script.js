document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('main > section');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            sections.forEach(section => {
                if (section.id === targetId) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });

            // Scroll to the top of the section
            document.querySelector(`#${targetId}`).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initial display setup
    sections.forEach(section => section.style.display = 'none');
    sections[0].style.display = 'block'; // Display the first section by default
});
