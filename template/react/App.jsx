import { useEffect, useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h1>你好啊，李银河~！</h1>
      <p>Count: {count}</p>
    </div>
  );
};


export default App;