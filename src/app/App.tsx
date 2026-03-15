import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './context/AppContext';
import { QuickView } from './components/QuickView';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <QuickView />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}