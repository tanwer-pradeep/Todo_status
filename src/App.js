import { Provider } from 'react-redux';
import GroupComponent from './components/GroupComponent';
import store from './Redux/store';

function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <GroupComponent />
    </div>

    </Provider>
  );
}

export default App;
