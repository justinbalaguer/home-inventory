import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Button,Table,Form} from 'react-bootstrap';

const API_CONTAINER_URL = 'http://localhost:5000/api/containers';

const App = () => {
  const [containers, setContainers] = useState([]);
  const [containerInputs, setContainerInputs] = useState({
    hidden: true,
    action: ''
  });
  const [containerInfo, setContainerInfo] = useState({
    id: '',
    name: '',
    color: '',
    action: ''
  });
  const {id,name,color} = containerInfo;

  const getContainers = async() => {
    const response = await axios.get(API_CONTAINER_URL);
    const data = response.data;
    setContainers([...data]);
  }

  useEffect(() => {
    getContainers();
  }, [])

  const view = (id) => {
    console.log(`view items from container ${id} `)
  }

  const handleAction = (id,name,color,action) => {
    setContainerInfo({id: id, name: name, color: color, action: action});
    setContainerInputs({hidden: false, action: action});
  }

  const inputChange = (e) => {
    const {name,value} = e.target;
    setContainerInfo({...containerInfo, [name]: value});
  }

  const save = async(action) => {
    const id = containerInfo.id;
    const name = containerInfo.name;
    const color = containerInfo.color;
    const response = await axios.post(`${API_CONTAINER_URL}/${action}`,{
      id: id,
      name: name,
      color: color
    });
    if(response.status===200) {
      getContainers();
      setContainerInputs({hidden: true, action: ''});
    }
  }

  const [searchKeyword,setSearchKeyword] = useState('');
  const search = (e) => {
    let keyword = e.target.value;
    setSearchKeyword(keyword);
  }

  const containerData = containers.filter((data) => {
    if(searchKeyword === '') {
      return data;
    } else if(data.name.toLowerCase().includes(searchKeyword) || (data.color.toLowerCase().includes(searchKeyword))){
      return data;
    }
  }).map((data,i) => {
    return(
      <tr key={i}>
        <td><Button type='button' block onClick={() => view(data._id)}>{data.name}</Button></td>
        <td>{data.color}</td>
        <td><Button type='button' variant='secondary' block onClick={() => handleAction(data._id,data.name,data.color,'edit')}>Edit</Button></td>
        <td><Button type='button' variant='danger' block onClick={() => handleAction(data._id,'','','delete')}>Delete</Button></td>
      </tr>
    )
  })

  return (
    <Container className="App">
    <h1 className='text-center'>Home Inventory</h1>
    <div>
     <Form.Control type='text' onChange={search} />
     <br/>
    </div>
    <Button type='button' variant='success' block onClick={() => handleAction('','','','add')}>Add</Button>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Container</th>
          <th>Color</th>
          <th colSpan={2}>Action</th>
        </tr>
      </thead>
      <tbody>
        {containerData}
      </tbody>
    </Table>
    {/* Edit Form */}
    {containerInputs.hidden === false && (
      <Form>
        <Form.Group>
        <Form.Control type='text' id='id' name='id' onChange={inputChange} value={id} hidden={true} />
          <Form.Label htmlFor='name'>Name</Form.Label>
          <Form.Control type='text' id='name' name='name' onChange={inputChange} value={name} />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='color'>Color</Form.Label>
          <Form.Control type='text' id='color' name='color' onChange={inputChange} value={color} />
        </Form.Group>
        <Form.Group>
          {containerInfo.action==='delete' && (<p>Are you sure you want to delete?</p>)}
          <Button type='button' onClick={() => save(containerInputs.action)} >{containerInfo.action==='delete' ? ('Yes') : ('Save')}</Button>
        </Form.Group>
      </Form>
    )}
    </Container>
  );
}

export default App;
