import { Button, Card, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { useDispatch } from "react-redux";
import { UpdateGroups } from '../Redux/action';

const GroupComponent = ({ newgroups }) => {
  const [loading, setLoading] = useState(false);
  const [isAllGroupsValid, setAllGroupsValid] = useState(true)
  const dispatch = useDispatch()

  const addGroup = () => {
    const newObj = {
      from:  "",
      to: "",
      todos: []
    };
    dispatch(UpdateGroups([...newgroups, newObj]))
  };

  const handlValueChange = (value, index, name) => {
    let newValue;
    if (!value) {
      newValue = 0;
    } else {
      newValue = value;
    }
    switch (name){
      case "to":
        console.log(name, "from switch case");
        break;
      default:
        console.log(name, "from switch case");
        if(index !== 0){
          newgroups[index - 1].to = value - 1;
        }
        break;
    }
    const updatedGroups = [...newgroups];
    updatedGroups[index][name] = newValue;
    dispatch(UpdateGroups(updatedGroups))
  };
  const getDataFromApi = async (from, to) =>{
    let dataFromApi = [];
      await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${from - 1}&_end=${to}`).then(result =>{
          return result.json();
        }).then(data => {
          dataFromApi = [...data]
        }).catch(err => console.log(err, "############33"))
    // }
    setLoading(false)
    return dataFromApi;

  }

  const checking = () => {
    newgroups.forEach(group =>{
      if(group.from === "" || group.to === "") {
        setAllGroupsValid(false);
        return;
      }
      setAllGroupsValid(true);
      return;
    })
  }

  useEffect(() =>{
    checking()
  }, [newgroups])
  
  const showAllStatus = () => {
    setLoading(true);
    const updatedGroups = [...newgroups];
    updatedGroups.forEach(async (_val, index) => {
      updatedGroups[index].showCard = !updatedGroups[index].showCard;
      const todosForRange = await getDataFromApi(_val.from, _val.to);
      updatedGroups[index].todos = [...todosForRange];
      
    });
    dispatch(UpdateGroups(updatedGroups))
  };

  const deleteGroup = (index) => {

    let updatedGroups = [...newgroups];
    if(index === 0){
      newgroups[1].from = newgroups[0].from
    }else {
      newgroups[index - 1].to = newgroups[index].to
    }
    updatedGroups.splice(index, 1);
    dispatch(UpdateGroups(updatedGroups))    
  };
  return (
    <>
      {newgroups?.map((element, index) => (
        <div>
          <Button
            disabled={newgroups.length === 1}
            onClick={() => {
              deleteGroup(index);
            }}
          >
            Delete
          </Button>
          Group {index + 1}
          <Space direction="horizontal">
            <InputNumber
              min={index === 0 ? 1 : newgroups[index - 1]?.from + 1}
              max={10}
              addonBefore={"From"}
              value={element?.from}
              onChange={(value) => {
                handlValueChange(value, index, "from");
              }}
            />
            <InputNumber
              addonBefore="To"
              min={element?.from}
              max={10}
              value={element?.to}
              onChange={(value) => {
                handlValueChange(value, index, "to");
              }}
            />
            {loading ? <>loading ...</>:element.showCard && (
              <Card>
                {element.todos?.map((val) => {
                  return  <>
                      <span>
                        {val.id} {String(val.completed)}{" "}
                      </span>
                    </>
                  
                })}
              </Card>
            )}
          </Space>
        </div>
      ))}
      <Button
        disabled={newgroups.length > 9}
        onClick={() => {
          addGroup();
        }}
      >
        +
      </Button>
      <Button
        disabled={!isAllGroupsValid}
        onClick={() => {
          showAllStatus();
        }}
      >
        {newgroups[0].showCard ?"hide status":"Show Status"}
      </Button>
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    newgroups: state.groups

  };
};


export default connect(mapStateToProps)(GroupComponent);
