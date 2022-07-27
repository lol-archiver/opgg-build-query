import { reactive } from 'vue';



export const B = reactive({});


export const install = app => {
	app.mixin({ data() { return { B }; } });
};
