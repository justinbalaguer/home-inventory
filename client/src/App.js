import React, {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,Button,Table,Form} from 'react-bootstrap';
import './styles/index.scss';

const API_CONTAINER_URL = 'http://localhost:5000/api/containers/';
const API_ITEM_URL = 'http://localhost:5000/api/items/';

const App = () => {

  /* CONTAINER */
  const [container, setContainer] = useState([]);
  const [item, setItem] = useState([]);
  const [info, setInfo] = useState({
    id: '',
    name: '',
    description: '',
    action: '',
    container_id: ''
  });
  const {id,name,description} = info;
  const [select, setSelect] = useState('container');
  const [containerId, setContainerId] = useState('');
  const [containerName, setContainerName] = useState('');
  const [hidden, setHidden] = useState(true);

  //search
  const [searchKeyword,setSearchKeyword] = useState('');
  const search = (e) => {
    let keyword = e.target.value;
    setSearchKeyword(keyword);
    if(keyword==='') {
      setSelect('container');
      setContainerName('');
    } else {
      setSelect('item');
      getAllItems();
    }
  }

  //get all items
  const getAllItems = async () => {
    const response = await axios.get(`${API_ITEM_URL}`);
    const data = response.data;
    setItem([...data]);
    // eslint-disable-next-line
    item.filter(item => {
      if(item.name.toLowerCase().includes(searchKeyword) || item.description.toLowerCase().includes(searchKeyword)) {
        const id = item.container_id;
        getAllItemsContainer(id);
      }
    })
  }

  const getAllItemsContainer = async (id) => {
    const response_container = await axios.get(`${API_CONTAINER_URL}${id}`);
    const data_container = response_container.data;
    setContainerName(data_container.name);
  }

  //get containers
  const getContainers = async () => {
    const response = await axios.get(`${API_CONTAINER_URL}`);
    const data = response.data;
    setContainer([...data]);
  }

  //get items
  const getItems = async (id) => {
    const response = await axios.get(`${API_ITEM_URL}container/${id}`);
    const data = response.data;
    setItem([...data]);
    setSelect('item');
    setContainerId(id);

    const response_container = await axios.get(`${API_CONTAINER_URL}${id}`);
    const data_container = response_container.data;
    setContainerName(data_container.name);
  }

  //functions
  const inputChange = (e) => {
    const {name,value} = e.target;
    setInfo({
      ...info,
      [name]: value
    });
  }

  const handleAction = (id,name,description,action,container_id) => {
    setInfo({
      id: id,
      name: name,
      description: description,
      action: action,
      container_id: container_id
    });
    setHidden(false);
  }

  const save = async () => {
    if(select==='container') {
      if(info.action==='post') {
        const response = await axios.post(`${API_CONTAINER_URL}`,info);
        if(response.status===200) {
          getContainers();
        }
      } else if(info.action==='put') {
        const response = await axios.put(`${API_CONTAINER_URL}${info.id}`,info);
        if(response.status===200) {
          getContainers();
        }
      } else if(info.action==='delete') {
        const response = await axios.delete(`${API_CONTAINER_URL}${info.id}`,info);
        if(response.status===200) {
          getContainers();
        }
      }
    } else if(select==='item') {
      if(info.action==='post') {
        const response = await axios.post(`${API_ITEM_URL}`,info);
        if(response.status===200) {
          getItems(info.container_id);
        }
      } else if(info.action==='put') {
        const response = await axios.put(`${API_ITEM_URL}${info.id}`,info);
        if(response.status===200) {
          getItems(info.container_id);
        }
      } else if(info.action==='delete') {
        const response = await axios.delete(`${API_ITEM_URL}${info.id}`,info);
        if(response.status===200) {
          getItems(info.container_id);
        }
      }
    }
  }

  //container list
  const containerList = container && container.map((data,i) => {
    return(
      <tr key={i}>
        <td><Button block onClick={() => getItems(data._id)}>{data.name}</Button></td>
        <td>{data.description}</td>
        <td><Button variant={'secondary'} block onClick={() => handleAction(data._id,data.name,data.description,'put')}>Edit</Button></td>
        <td><Button variant={'danger'} block onClick={() => handleAction(data._id,'','','delete')}>Delete</Button></td>
      </tr>
    )
  })

  //item list
  // eslint-disable-next-line
  const itemList = item && item.filter((data) => {
    if(searchKeyword === '') {
      return data;
    } else if(data.name.toLowerCase().includes(searchKeyword) || (data.description.toLowerCase().includes(searchKeyword))){
      return data;
    }
  }).map((data,i) => {
    return(
      <tr key={i}>
        <td>{data.name}</td>
        <td>{data.description}</td>
        <td><Button variant={'secondary'} block onClick={() => handleAction(data._id,data.name,data.description,'put',data.container_id)}>Edit</Button></td>
        <td><Button variant={'danger'} block onClick={() => handleAction(data._id,'','','delete',data.container_id)}>Delete</Button></td>
      </tr>
    )
  })

  useEffect(() => {
    getContainers();
  }, [])

  return (
    <Container className="App">
    <h1 className='text-center'>Home Inventory</h1>
    <div className={`${hidden===false && 'hidden'}`}>
      <div>
      <Form.Control type='text' onChange={search} />
      <br/>
      </div>
      <Button type='button' variant='success' block onClick={() => handleAction('','','','post',containerId)}>Add</Button>
      {select === 'item' && (
        <Button type='button' variant='danger' block onClick={() => {setSelect('container');setContainerName('')}}>Cancel</Button>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr className='text-center'>
            <th colSpan={4}>{containerName}</th>
          </tr>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {select === 'container' ? containerList : itemList}
        </tbody>
      </Table>
    </div>

    {/* Form */}
    <Form className={`${hidden && 'hidden'}`}>
      {info.action === 'delete' ? ('Are you sure you want to delete?') : (
        <>
        <Form.Group>
          <Form.Control type='text' id='id' name='id' onChange={inputChange} value={id} hidden={true} />
          <Form.Label htmlFor='name'>Name</Form.Label>
          <Form.Control type='text' id='name' name='name' onChange={inputChange} value={name} />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='description'>Description</Form.Label>
          <Form.Control type='text' id='description' name='description' onChange={inputChange} value={description} />
        </Form.Group>
        </>
      )}
      <Form.Group>
        <Button className='mt-2 mr-2' type='button' variant={`success`} onClick={save}>{info.action === 'delete' ? ('Yes') : ('Save')}</Button>
        <Button className='mt-2 mr-2' type='button' variant='danger' onClick={() => setHidden(true)}>Cancel</Button>
      </Form.Group>
    </Form>

    </Container>
  );
}

export default App;
