import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Provider } from 'react-redux'
import { store } from './state/store.ts'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<NextUIProvider>
			<Provider store={store}>
				<App />
			</Provider>
		</NextUIProvider>
	</StrictMode>
)
