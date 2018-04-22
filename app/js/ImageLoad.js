import 'pixi.js';
import { TweenMax } from 'gsap';

export default class ImageLoader {
  constructor(swishImg) {
    this.src = swishImg.src;
    this.computedStyle = getComputedStyle(swishImg);
    this.width = +this.computedStyle.width.split('px')[0];
    this.height = +this.computedStyle.height.split('px')[0];

    swishImg.insertAdjacentHTML(
      'afterend',
      document.createElement('div').outerHTML
    );
    this.wrapper = swishImg.nextSibling;
    this.wrapper.classList.add('swish-container');

    swishImg.parentNode.removeChild(swishImg);

    this.isAnimated = false;
    this.isHovered = false;

    this.app = new PIXI.Application(this.width, this.height, {
      transparent: true
    });

    this.wrapper.append(this.app.view);

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    this.load(this.startAnimation.bind(this));
  }
  load(afterLoad) {
    const tmpImg = new Image();
    tmpImg.src = this.src;
    tmpImg.addEventListener('load', afterLoad);
  }
  startAnimation() {
    this.bg = PIXI.Sprite.fromImage(this.src);
    this.bg.width = this.width;
    this.bg.height = this.height;
    this.bg.position.x = 0;
    this.bg.position.y = 0;
    this.container.addChild(this.bg);

    this.displacementSprite = PIXI.Sprite.fromImage('img/displacement.jpg');
    this.displacementSprite.texture.baseTexture.wrapMode =
      PIXI.WRAP_MODES.REPEAT;
    this.displacementFilter = new PIXI.filters.DisplacementFilter(
      this.displacementSprite
    );
    this.displacementFilter.scale.set(50 + Math.random() * 50);
    this.displacementSprite.scale.set(0.4 + 0.6 * Math.random());

    this.app.stage.addChild(this.displacementSprite);

    this.container.filters = [this.displacementFilter];

    this.click();
    this.hover();
  }
  click() {
    this.wrapper.addEventListener('click', () => {
      TweenMax.to(this.displacementFilter.scale, 1, {
        x: 0,
        y: 0,
        onComplete: () => {
          this.isAnimated = true;
        }
      });
    });
  }
  hover() {
    this.wrapper.addEventListener('mouseover', () => {
      if (!this.isHovered && this.isAnimated) {
        this.isHovered = true;
        TweenMax.ticker.addEventListener('tick', this.doWaves, this);
        TweenMax.to(this.displacementFilter.scale, 0.5, { x: 15, y: 15 });
      }
    });
    this.wrapper.addEventListener('mouseout', () => {
      if (this.isHovered && this.isAnimated) {
        this.isHovered = false;
        TweenMax.ticker.removeEventListener('tick', this.doWaves, this);
        TweenMax.to(this.displacementFilter.scale, 0.5, { x: 0, y: 0 });
      }
    });
  }
  doWaves() {
    this.displacementSprite.x += 1;
  }
}
