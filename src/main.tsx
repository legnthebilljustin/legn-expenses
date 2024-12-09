import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Provider } from 'react-redux'
import { store } from './state/store.ts'
import { RouterProvider } from 'react-router-dom'
import router from './router/index.tsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config.tsx'
import { setUid } from './state/authSlice.ts'

onAuthStateChanged(auth, (user) => {
	if (user) {
		store.dispatch(setUid(user?.uid))
	}
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<NextUIProvider>
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>
		</NextUIProvider>
	</StrictMode>
)
