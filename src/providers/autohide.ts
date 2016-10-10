import { Injectable } from '@angular/core';

@Injectable()
export class AutohideService {
  init(content, callback) {
    let scroller = content.getElementRef().nativeElement.querySelector('.scroll-content')
    let throttleTimeout	= 500;
    let throttle = ( delay, fn ) => {
			var last, deferTimer;
			return function()
			{
				var context = this, args = arguments, now = +new Date;
				if( last && now < last + delay )
				{
					clearTimeout( deferTimer );
					deferTimer = setTimeout( function(){ last = now; fn.apply( context, args ); }, delay );
				}
				else
				{
					last = now;
					fn.apply( context, args );
				}
			};
		};

		var dHeight			= 0,
			wHeight			= 0,
			wScrollCurrent	= 0,
			wScrollBefore	= 0,
			wScrollDiff		= 0;

    scroller.addEventListener('scroll', throttle( throttleTimeout, () => {
      dHeight			= scroller.offsetHeight;
			wHeight			= content.height();
			wScrollCurrent	= scroller.scrollTop;
			wScrollDiff		= wScrollBefore - wScrollCurrent;

			if( wScrollCurrent <= 0 ) {
        callback(false);
      }

			else if( wScrollDiff > 0) {
        callback(false);
      }

			else if( wScrollDiff < 0 )
			{
        callback(true);
			}

			wScrollBefore = wScrollCurrent;
    }));
  }

  destroy(content) {
    let scroller = content.getElementRef().nativeElement.querySelector('.scroll-content')
    scroller.removeEventListener('scroll')
  }
}
