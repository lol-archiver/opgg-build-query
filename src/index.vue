<template>
	<!-- 侧边栏 -->
	<Sidebar hidden />


	<!-- 主模块 -->
	<p-main>
		<keep-alive>
			<component :is="moduleNow" :key="`module-${moduleNow}`" />
		</keep-alive>
	</p-main>
</template>

<script setup>
	import { onMounted } from 'vue';

	import { CV } from './lib/plugin/CSSVar.js';

	import Sidebar, { moduleNow, tabs } from './lib/Sidebar.vue';



	document.title = 'OP.GG 大乱斗速查';


	CV.setAll({
		widthScroll: '0.5rem',
		heightTopbar: '0rem',
	});


	onMounted(() => tabs.addIcon('大乱斗速查', null, 'opgg-query', 'opgg-query'));
</script>

<style lang="sass" scoped>
p-sidebar
	@apply fixed z-50 shadow-mdd p-1 bg-gray-100
	width: var(--widthSidebar)
	height: calc(100% - var(--heightTopbar))
	top: var(--heightTopbar)
	background-color: var(--colorMain)


	svg[corn]
			@apply absolute opacity-25 z-10 text-xs top-1 left-1


	p-button
		@apply relative block rounded-md text-center text-xl shadow-mdd mt-2 cursor-pointer outline-none h-8 leading-8
		width: calc( var(--widthSidebar) - 0.55rem)
		background-color: var(--colorTextMain)
		color: var(--colorText)

		&:focus
			@apply ring-2 ring-yellow-500

		&[profile]
			@apply font-bold mt-0

		&[expand]
			@apply overflow-hidden px-1

			&:focus-within
				@apply overflow-visible w-24 ring-2 ring-yellow-500

			input
				@apply rounded-md w-full text-center outline-none z-20 bg-transparent

		&[keyword]:focus-within
			@apply w-48

		&[now]
			@apply ring-2 ring-pink-400

		p-header
			@apply relative block rounded-md shadow-md absolute top-1 left-1 bg-cover
			width: calc(100% - 0.5rem)
			height: calc(100% - 0.5rem)


	p-profiles
		@apply block p-0.5 pt-0

		p-profile-id
			@apply relative block rounded-md mt-2 text-center text-xl shadow-mdd cursor-pointer outline-none w-40 elli
			height: calc( var(--widthSidebar) - 0.55rem)
			line-height: calc( var(--widthSidebar) - 0.55rem)
			background-color: var(--colorTextMain)
			color: var(--colorText)

			&:hover
				@apply ring-2 ring-green-500

			&[now]
				@apply font-bold



p-main
	margin-top: var(--heightTopbar)
	margin-left: var(--widthSidebar)
	width: calc(100% - var(--widthSidebar))
	@apply block relative

	module
		@apply block relative
</style>


<style lang="postcss">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>


<style lang="sass">
html
	--colorMain: theme("colors.blue.500")
	--colorMainDark: theme("colors.blue.700")
	--colorMainLight: theme("colors.blue.400")
	--colorBackground: theme("colors.gray.100")
	--colorText: theme("colors.gray.900")
	--colorTextMain: theme("colors.gray.100")
	--colorDisable: theme("colors.gray.500")
	--colorOkay: theme("colors.green.500")
	--colorFail: theme("colors.red.500")
	--cAccentSelected: theme("colors.blue.200")
	--cAccentHover: theme("colors.green.200")
	--cLightD: theme("colors.gray.200")

html
	@apply h-full overflow-x-hidden overflow-y-auto
	color: var(--colorText)


// body
// 	@apply bg-gray-500 sm:bg-blue-400 md:bg-red-400 lg:bg-green-500 xl:bg-yellow-500

input
	color: var(--colorText)

/** Scrollbar Style **/
*
	scrollbar-width: thin
	scrollbar-color: rgba(119, 119, 119, 0.3) rgba(119, 119, 119, 0.1)

::-webkit-scrollbar
	width: var(--widthScroll)
	height: var(--widthScroll)

::-webkit-scrollbar-track:hover
	background-color: rgba(119, 119, 119, 0.1)

::-webkit-scrollbar-thumb
	border-radius: var(--widthScroll)
	background: rgba(119, 119, 119, 0.3)

::-webkit-scrollbar-thumb:hover
	background: rgba(119, 119, 119, 0.4)

::-webkit-scrollbar-thumb:active
	background: rgba(119, 119, 119, 1)

::-webkit-scrollbar-corner
	background-color: transparent


.transAll, .transAll *, .trans
	transition-property: all
	transition-duration: 0.4s

	-webkit-transform: translateZ(0)
	-moz-transform: translateZ(0)
	-ms-transform: translateZ(0)
	-o-transform: translateZ(0)
	transform: translateZ(0)

	&._d02
		transition-duration: 0.2s
	&._d07
		transition-duration: 0.7s
	&._d2
		transition-duration: 2s
</style>
