import { Button, Card, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";

const GroupComponent = () => {
  const [groups, setGroups] = useState([
    { from: 1, to: 10, showCard: false, todos:[] },
  ]);
  const [loading, setLoading] = useState(false);
  const [isAllGroupsValid, setAllGroupsValid] = useState(true)

  const addGroup = () => {
    const newObj = {
      from:  "",
      to: "",
      showCard: false,
    };
    setGroups((prev) => [...prev, newObj]);
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
          groups[index - 1].to = value - 1;
        }
        break;
    }
    const updatedGroups = [...groups];
    updatedGroups[index][name] = newValue;
    setGroups(updatedGroups);
  };
  const getDataFromApi = async (from, to) =>{
    const dataFromApi = [];
    for(let index = from; index <= to; index++){
      await fetch(`https://jsonplaceholder.typicode.com/todos/${index}`).then(result =>{
          return result.json();
        }).then(data => {
          dataFromApi.push(data)
        }).catch(err => console.log(err, "############33"))
    }
    setLoading(false)
    return dataFromApi;

  }

  const checking = () => {
    groups.forEach(group =>{
      console.log("from each group", group)
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
  }, [groups])
  
  const showAllStatus = () => {
    setLoading(true);
    const updatedGroups = [...groups];
    groups.forEach(async (_val, index) => {
      updatedGroups[index].showCard = !updatedGroups[index].showCard;
      const todosForRange = await getDataFromApi(_val.from, _val.to);
      updatedGroups[index].todos = [...todosForRange];
      
    });
    setGroups(updatedGroups);

  };

  const deleteGroup = (index) => {

    let updatedGroups = [...groups];
    if(index === 0){
      groups[1].from = groups[0].from
    }else {
      groups[index - 1].to = groups[index].to
    }
    updatedGroups.splice(index, 1);
    setGroups(updatedGroups);
  };
  return (
    <>
      {groups?.map((element, index) => (
        <div>
          <Button
            disabled={groups.length === 1}
            onClick={() => {
              deleteGroup(index);
            }}
          >
            Delete
          </Button>
          Group {index + 1}
          <Space direction="horizontal">
            <InputNumber
              min={index === 0 ? 1 : groups[index - 1].from + 1}
              max={10}
              addonBefore={"From"}
              value={element.from}
              onChange={(value) => {
                handlValueChange(value, index, "from");
              }}
            />
            <InputNumber
              addonBefore="To"
              min={element.from}
              max={10}
              value={element.to}
              onChange={(value) => {
                handlValueChange(value, index, "to");
              }}
            />
            {loading ? <>loading ...</>:element.showCard && (
              <Card>
                {element.todos.map((val, index) => {
                  return  (index >= element.from - 1) && (index < element.to) ?(
                    <>
                      <span>
                        {val.id} {String(val.completed)}{" "}
                      </span>
                    </>
                  ): null
                })}
              </Card>
            )}
          </Space>
        </div>
      ))}
      <Button
        disabled={groups.length > 9}
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
        {groups[0].showCard ?"hide status":"Show Status"}
      </Button>
    </>
  );
};

export default GroupComponent;
