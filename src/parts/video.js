function lazyLoadVideo() {
    let lazyVideos = [...document.querySelectorAll("video")];

    lazyVideos.forEach(item => {
        let src = item.querySelector('source');
        let dataSrc = src.getAttribute('data-src');

        if (!dataSrc) {
            item.parentElement.remove();
        }
    });

    if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (video) {
                if (video.isIntersecting) {
                    for (let source in video.target.children) {
                        let videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    // video.tareget.load only if it's not loaded
                    if (!video.target.classList.contains('loaded')) {
                        video.target.load();
                    }

                    video.target.classList.add("loaded");
                    video.target.classList.remove("lazy");
                } else {
                    video.target.pause();
                }
            });
        });

        lazyVideos.forEach(function (lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
    // get assemble-main__item elems
    const assembleMainItems = document.querySelectorAll('.assemble-main__item');

    // loop through all elems
    assembleMainItems.forEach((item, i) => {
        // find video inside elem, on hover play video, on mouseleave pause video
        const video = item.querySelector('video');
        item.addEventListener('mouseenter', () => {
            video.play();
        });
        item.addEventListener('mouseleave', () => {
            video.pause();
        });
    });
}

export default lazyLoadVideo;