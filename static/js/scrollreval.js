window.sr = ScrollReveal();
sr.reveal('#images', { 
    duration: 4000,
    origin: 'right',
    distance: '400px',
});
sr.reveal('.container-fluid', { duration: 3000 });
sr.reveal('.row', { duration: 3000 });
sr.reveal('.header-title', {
     duration: 3000,
     origin: 'left',
    distance: '100px',
     });

sr.reveal('#drones',{
    duration: 1000,
    scale: 1,
    distance: '50px',
    viewFactor: 0.5,
    origin: 'bottom',
    delay: 200,
});


sr.reveal('#special',{
   
});

// sr.init();