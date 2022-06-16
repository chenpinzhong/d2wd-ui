import { useSearchParams, useParams } from 'react-router-dom';
function App() {
    let [params] = useSearchParams();

    let { path } = useParams();
    let id = params.get('id')
    let name = params.get('name')
    console.log(path)
    return (
        <div>
            登陆用户ID {id} name:{name} path:{path}
        </div>
    )
}
export default App