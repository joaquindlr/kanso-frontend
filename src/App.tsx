import { AppRouter } from "./AppRouter";
import { useAuthSession } from "./hooks/useAuthSession";

function App() {
  useAuthSession();

  return <AppRouter />;
}

export default App;
