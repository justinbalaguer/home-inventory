import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Button,Table,Form} from 'react-bootstrap';
import './styles/index.scss';

const API_CONTAINER_URL = 'http://localhost:5000/api/containers/';

const App = () => {

  /* CONTAINER */
  const [container, setContainer] = useState([]);
  const [info, setInfo] = useState({
    id: '',
    name: '',
    description: '',
    action: ''
  });
  const {id,name,description} = info;

  //get containers
  const getContainers = async () => {
    const response = await axios.get(`${API_CONTAINER_URL}`);
    const data = response.data;
    setContainer([...data]);
  }

  //functions
  const inputChange = (e) => {
    const {name,value} = e.target;
    setInfo({
      ...info,
      [name]: value
    });
  }

  const handleAction = (id,name,description,action) => {
    setInfo({
      id: id,
      name: name,
      description: description,
      action: action
    });
  }

  const save = async () => {
    if(info.action==='post') {
      const response = await axios.post(`${API_CONTAINER_URL}`,info);
      if(response.status===200) {
        getContainers();
      }
    } else if(info.action==='put') {
      const response = await axios.put(`${API_CONTAINER_URL}/${info.id}`,info);
      if(response.status===200) {
        getContainers();
      }
    } else if(info.action==='delete') {
      const response = await axios.delete(`${API_CONTAINER_URL}/${info.id}`,info);
      if(response.status===200) {
        getContainers();
      }
    }
  }

  //container list
  const containerList = container && container.map((data,i) => {
    return(
      <tr key={i}>
        <td><Button block>{data.name}</Button></td>
        <td>{data.description}</td>
        <td><Button variant={'secondary'} block onClick={() => handleAction(data._id,data.name,data.description,'put')}>Edit</Button></td>
        <td><Button variant={'danger'} block onClick={() => handleAction(data._id,'','','delete')}>Delete</Button></td>
      </tr>
    )
  })

  useEffect(() => {
    getContainers();
  }, [])

  return (
    <Container className="App">
    <h1 className='text-center'>Home Inventory</h1>
    <div>
      <div>
      <Form.Control type='text' />
      <br/>
      </div>
      <Button type='button' variant='success' block onClick={() => handleAction('','','','post')}>Add</Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {containerList}
        </tbody>
      </Table>
    </div>

    {/* Form */}
    <Form>
    <Form.Group className>
      <Form.Control type='text' id='id' name='id' onChange={inputChange} value={id} hidden={true} />
        <Form.Label htmlFor='name'>Name</Form.Label>
        <Form.Control type='text' id='name' name='name' onChange={inputChange} value={name} />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor='description'>Description</Form.Label>
        <Form.Control type='text' id='description' name='description' onChange={inputChange} value={description} />
      </Form.Group>
        <Form.Group>
          <Button type='button' variant={`success`} onClick={save}>Save</Button>
          <Button type='button' variant='danger'>Cancel</Button>
        </Form.Group>
      </Form>
    </Container>
  );
}

export default App;
