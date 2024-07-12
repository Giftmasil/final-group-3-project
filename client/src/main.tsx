import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/ReduxStore.ts'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import 'leaflet/dist/leaflet.css'
import theme from './theme/theme.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <Provider store={store}>
                <App />
            </Provider>
        </ChakraProvider>
    </React.StrictMode>,
)
