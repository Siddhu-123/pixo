import React, { useEffect } from "react";
const Cursor = ({ stars }) => {
  stars = true;
  useEffect(() => {
    if (stars) {
      let start = new Date().getTime();
      const originPosition = { x: 0, y: 0 };
      const last = {
        starTimestamp: start,
        starPosition: originPosition,
        mousePosition: originPosition,
      };
      const config = {
      starAnimationDuration: 1500,
      minimumTimeBetweenStars: 100,
      minimumDistanceBetweenStars: 10,
      maximumGlowPointSpacing: 10,
      colors: ["249 146 253", "252 254 255"],
      sizes: ["1rem", "1rem", "0.6rem"],
      animations: ["fall-1", "fall-2", "fall-3"]
      }
      let count = 0;
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
          selectRandom = items => items[rand(0, items.length - 1)];

      const withUnit = (value, unit) => `${value}${unit}`,
          px = value => withUnit(value, "px"),
          ms = value => withUnit(value, "ms");
      const calcDistance = (a, b) => {
      const diffX = b.x - a.x,
              diffY = b.y - a.y;
      
      return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      }

      const calcElapsedTime = (start, end) => end - start;

      const appendElement = element => document.body.appendChild(element),
          removeElement = (element, delay) => setTimeout(() => document.body.removeChild(element), delay);

      const createStar = position => {
      const star = document.createElement("span"), color = selectRandom(config.colors);
      star.innerHTML = '&#9733;';
      star.className = "star";
      star.style.left = px(position.x);
      star.style.top = px(position.y);
      star.style.fontSize = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animationName = config.animations[count++ % 3];
      star.style.starAnimationDuration = ms(config.starAnimationDuration);
      
      appendElement(star);

      removeElement(star, config.starAnimationDuration);
      }


      const updateLastStar = position => {
      last.starTimestamp = new Date().getTime();
      last.starPosition = position;
      }

      const updateLastMousePosition = position => last.mousePosition = position;

      const adjustLastMousePosition = position => {
      if(last.mousePosition.x === 0 && last.mousePosition.y === 0) {
          last.mousePosition = position;
      }
      };


      const handleOnMove = e => {
        const mousePosition = { x: e.clientX, y: e.clientY }
        
        adjustLastMousePosition(mousePosition);
        
        const now = new Date().getTime(),
                hasMovedFarEnough = calcDistance(last.starPosition, mousePosition) >= config.minimumDistanceBetweenStars,
                hasBeenLongEnough = calcElapsedTime(last.starTimestamp, now) > config.minimumTimeBetweenStars;
        
        if(hasMovedFarEnough || hasBeenLongEnough) {
            createStar(mousePosition);
            
            updateLastStar(mousePosition);
        }
        
        updateLastMousePosition(mousePosition);
        }

        window.onmousemove = (e) => handleOnMove(e);
        window.ontouchmove = (e) => handleOnMove(e.touches[0]);

      const createExplosion = (position) => {
        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.style.left = px(position.x);
        explosion.style.top = px(position.y);
        document.body.appendChild(explosion);
    
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 3;
          const distance = Math.random() * 50;
          const starX = position.x + distance * Math.cos(angle);
          const starY = position.y + distance * Math.sin(angle);
          createStar({ x: starX, y: starY });
        }
    
        setTimeout(() => {
          document.body.removeChild(explosion);
        }, 1000);
      };

      const handleOnClick = (e) => {
        const clickPosition = { x: e.clientX, y: e.clientY };
        createExplosion(clickPosition);
      };

      window.onclick = (e) => handleOnClick(e);
      document.body.onmouseleave = () =>
        updateLastMousePosition(originPosition);


      // custom cursor
      const customCursor = document.createElement("div");
      const svgCursor = document.createElement("div");
      const svgContent = `
      <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_i_0_1)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.3713 7.8121L1.65516 2.74538C1.60409 2.60008 1.59512 2.4433 1.62929 2.29312C1.66346 2.14294 1.73937 2.00547 1.84828 1.89657C1.95719 1.78766 2.09466 1.71174 2.24484 1.67757C2.39502 1.64341 2.55179 1.65237 2.6971 1.70344L7.76382 3.41958C7.88891 3.46361 8.02266 3.47731 8.15408 3.45955C8.2855 3.44179 8.41082 3.39308 8.51974 3.31743L12.8101 0.109874C12.9319 0.0394049 13.0698 0.00157531 13.2105 4.82666e-05C13.3512 -0.00147877 13.4899 0.0333485 13.6132 0.101158C13.7365 0.168968 13.8402 0.267462 13.9142 0.387104C13.9883 0.506746 14.0302 0.643483 14.0359 0.784074L14.0359 6.13681C14.0398 6.268 14.073 6.39665 14.1331 6.51332C14.1932 6.62999 14.2787 6.73172 14.3832 6.81101L18.7553 9.89599C18.8807 9.98348 18.9791 10.1044 19.0392 10.245C19.0993 10.3856 19.1188 10.5402 19.0953 10.6914C19.0719 10.8425 19.0066 10.984 18.9068 11.0998C18.8069 11.2156 18.6766 11.3011 18.5306 11.3465L13.423 12.9401C13.2968 12.9765 13.1818 13.0443 13.0889 13.1372C12.996 13.2301 12.9282 13.345 12.8918 13.4713L11.2983 18.5789C11.2528 18.7249 11.1673 18.8552 11.0515 18.955C10.9357 19.0549 10.7942 19.1202 10.6431 19.1436C10.492 19.167 10.3373 19.1476 10.1967 19.0875C10.0561 19.0274 9.93519 18.929 9.84771 18.8036L6.86488 14.5132C6.78558 14.4087 6.68386 14.3232 6.56719 14.2631C6.45052 14.203 6.32187 14.1698 6.19068 14.1659L0.837942 14.1659C0.684445 14.1698 0.532962 14.1304 0.400851 14.0521C0.268739 13.9739 0.161346 13.86 0.090977 13.7235C0.0206084 13.587 -0.00988825 13.4335 0.00298148 13.2805C0.0158512 13.1275 0.0715676 12.9812 0.163744 12.8584L3.3713 8.56802C3.43055 8.45084 3.46142 8.32137 3.46142 8.19006C3.46142 8.05875 3.43055 7.92928 3.3713 7.8121Z" fill="white"/>
      </g>
      <g filter="url(#filter1_i_0_1)">
      <path d="M17.2556 14.7457L27.9631 25.4533C28.3353 25.8386 28.5412 26.3546 28.5365 26.8903C28.5319 27.426 28.317 27.9384 27.9382 28.3172C27.5594 28.696 27.047 28.9109 26.5113 28.9155C25.9757 28.9202 25.4596 28.7143 25.0743 28.3421L14.3422 17.6101C14.3422 17.6101 14.3959 16.0765 15.0164 15.4444C15.6582 14.7908 17.2556 14.7457 17.2556 14.7457Z" fill="black"/>
      </g>
      <defs>
      <filter id="filter0_i_0_1" x="0" y="0" width="19.105" height="19.1533" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="4.1"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.835294 0 0 0 0 0 0 0 0 1 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_1"/>
      </filter>
      <filter id="filter1_i_0_1" x="14.3423" y="14.7457" width="15.1943" height="15.1699" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="1" dy="1"/>
      <feGaussianBlur stdDeviation="1"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.835294 0 0 0 0 0 0 0 0 1 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_1"/>
      </filter>
      </defs>
      </svg>
      `;
      customCursor.classList.add("custom-cursor");
      svgCursor.innerHTML = svgContent;
      svgCursor.classList.add("svg-cursor");

      document.body.appendChild(customCursor);
      customCursor.appendChild(svgCursor);
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        customCursor.style.left = `${clientX - 10}px`;
        customCursor.style.top = `${clientY}px`;
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.body.removeChild(customCursor);
      };
    }
  }, [stars]);

  return <></>;
};

export default Cursor;