import React, {useState, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { toast} from "react-toastify";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import CustomSelect from "../components/CustomSelect";
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const ModifyMakeTeam = () =>{
    var _id = useParams();
    const [teamName, setTeamName] = useState("");//팀이름
    const [say, setSay] = useState("");//멘트
    const [numberPeople, setNumberPeople] = useState("");//모집인원수
    const sportsArray = ["스포츠선택","풋살", "농구", "탁구"];
    const [selectedSports, setSelectedSports] = useState("");
    //암호, 원하는 시간 넣을것
    // const [checkedInputs, setCheckedInputs] = useState([]);
    const [wantPlayTime,setWantPlayTime] = useState([]);
    const history = useHistory();
    var parseNumberPeople = 0;
    const selectTime = [
        '08:00 ~ 10:00',
        '10:00 ~ 12:00',
        '12:00 ~ 14:00',
        '14:00 ~ 16:00',
        '16:00 ~ 18:00',
        '18:00 ~ 20:00',
        '20:00 ~ 22:00',
        '22:00 ~ 24:00',
    ]

    useEffect(() =>{
        getMakeTeam();
    },[]);

    const timeHandler = (e) => {
        const {
          target: { value },
        } = e;
        setWantPlayTime(
          // On autofill we get a the stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

    const getMakeTeam = ()=>{
        const send_param ={
            _id: _id.data
        };
        axios.post("/makeTeam/getMakeTeam",send_param)
        .then(returnData=>{
            setTeamName(returnData.data.board.teamName);
            setSelectedSports(returnData.data.board.sport);
            setNumberPeople(returnData.data.board.maxNumberPeople);
            setNumberPeople(returnData.data.board.wantPlayTime);
            setSay(returnData.data.board.say);
        })
        .catch(err =>{
            console.log(err);
        })
    }


    const submitHandler = async (e) =>{
        try{
            e.preventDefault();
            parseNumberPeople = parseInt(numberPeople);

            const send_param = {
                "_id" : _id.data,
                "teamName" : teamName,
                "say": say,
                "maxNumberPeople" :parseNumberPeople,
                "selectedSports" :selectedSports,
                "wantPlayTime" : wantPlayTime,
            }
            if(selectedSports === "풋살" && parseNumberPeople > 8) throw new Error("풋살은 최대 8명까지만 이용가능!");
            if(selectedSports === "농구" && parseNumberPeople > 10) throw new Error("농구은 최대 10명까지만 이용가능!");
            if(selectedSports === "탁구" && parseNumberPeople > 4) throw new Error("탁구은 최대 4명까지만 이용가능!");
            if(selectedSports ==="스포츠선택") throw new Error("스포츠를 선택하세요!");
            await axios.post("/makeTeam/update",send_param);
            toast.success("업데이트 완료!");
            history.push("/");
        } catch(err){
            console.error(err);
            toast.error(err.message);
        }
    }

    return (
        <div style={{
            marginTop:100,
            maxWidth:400,
            marginLeft:"auto",
            marginRight:"auto",
        }}>
            <h3 style={{ textAlign: "center" }}>팀만들기 작성</h3>
            <form onSubmit={submitHandler}>
                <CustomInput label = "팀이름" value={teamName} setValue={ setTeamName } />
                <CustomSelect label = "스포츠  :  " value={selectedSports} selectArray = {sportsArray} setValue = {setSelectedSports}/>
                <CustomInput label = "모집인원" value={numberPeople} type="number" setValue = { setNumberPeople }/>

                <div>
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">원하는 시간(중복선택가능)</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            fullWidth
                            value={wantPlayTime}
                            onChange={timeHandler}
                            input={<OutlinedInput label="원하는 시간(중복선택가능)" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {selectTime.map((time) => (
                                <MenuItem key={time} value={time}>
                                    <Checkbox checked={wantPlayTime.indexOf(time) > -1} />
                                    <ListItemText primary={time} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <TextareaAutosize
                    defaultValue={say}
                    onChange ={(e)=>setSay(e.target.value)}
                    maxRows={10}
                    aria-label="maximum height"
                    placeholder="모집할 문장을 적으세요."
                    style={{ width: "100%",height: 150, marginTop:10}}
                />
                <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              글쓰기
            </Button>
            </form>
        </div>
    )

}

export default ModifyMakeTeam;