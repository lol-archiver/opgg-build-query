import { MouseMenuDirective } from '@howdyjs/mouse-menu';



export const install = app => {
	app.directive('menu', MouseMenuDirective);
};
