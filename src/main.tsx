import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Provider } from 'react-redux'
import { store } from './state/store.ts'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<NextUIProvider>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</NextUIProvider>
	</StrictMode>
)
