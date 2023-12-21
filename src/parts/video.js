const caseItems = document.querySelectorAll('.project-item');

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

caseItems.forEach((caseItem, i) => {
    const video = caseItem.querySelector('video');
    if (video) {
        video.pause();

        if (isMobileDevice()) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        gsap.to(video, { opacity: 1, duration: 1, onComplete: () => video.play() });
                    } else {
                        gsap.to(video, { opacity: 0, duration: 1, onComplete: () => {
                            video.pause();
                            video.currentTime = 0;
                        } });
                    }
                });
            });

            observer.observe(caseItem);
        } else {
          // if it's not a mobile device, dont use gsap. On mouse enter play video, on mouse leave play video to the end and pause it
          caseItem.addEventListener('mouseenter', () => {
            video.play();
          });

          // on mouse leave play video to the end and pause it
          caseItem.addEventListener('mouseleave', () => {

          });
        }
    }
});
