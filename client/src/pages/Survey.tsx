import React from 'react';
import { ExternalLink } from 'react-external-link';
import { imageUrl } from '../etc/config';
import 'moment/locale/ko';
import {useInterval} from 'react-use';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';

const LiveTimeContainer = () => {
  let [time, setTime] = React.useState(0.00);

  useInterval(()=> {
    setTime(time + 0.01);
  }, 10)

  return time;
}
const checkline = (data: string) => {
  let str = data;
  let str_arr = str.split('\n');
  let row = str_arr.length;
  let actual_row = row;
  let data_fixed = '';
  let data_len = 0;
  let current_row = 0;
  for(let i = 0; i < row; i++) {
    if(str_arr[i].length%20 === 0 && str_arr[i].length !== 0) {
      actual_row += str_arr[i].length/20 - 1;
    } else {
      actual_row += (str_arr[i].length-(str_arr[i].length%20))/20;
    }
    if(actual_row <= 13) {
      data_fixed += str_arr[i];
      data_len += str_arr[i].length;
      if(i !== (row - 1)) {
        current_row = actual_row - 1;
        data_fixed += '\n';
      }
    }
    if(actual_row > 13) {
      data_fixed += str_arr[i].slice(0, 20 * (13 - current_row));
    }
  }
  console.log(data_fixed);
  console.log(data_len);
  console.log(current_row);
  console.log(actual_row);
  return data_fixed;
}
let answer_1 = [`어머니`, '아버지', '아들, 딸', '연인, 배우자', '친구', '기타'];
let main_1 = `memento`;
let main_2 = `당신을 전하는 이야기`;
let text_1 = `당신에게 주어진 5분`;
let text_2 = `소중한 이를 떠올리는 5분간의 생각`;
let text_3 = `죽음을 앞둔 당신에게 주어진 5분.
단 한사람과 이야기를 할 수 있다면
당신은 어떤 사람을 떠올리게 될까요?

잠시 눈을 감고 상상해봅시다.
‘그 사람과의 마지막 이야기’에 대하여.

충분히 몰입하신 후에
‘다음’ 버튼을 눌러주세요.

(최적화된 경험을 위해 소리를 켜주세요)`;
let text_4 = `죽음 앞에 놓인 당신에게
가장 먼저 떠오른 사람은 누구인가요?`;
let text_5_1 = `당신에게 그 사람은
어떤 존재인가요?`;
let text_5_2 = `아래 버튼을 선택해주세요`;
let text_6 = ['든든한 나무같은 사람', '포근한 구름같은 사람', '즐거운 놀이터같은 사람', '넉넉한 호수같은 사람'];
let text_7 = [`당신에게 무슨 일이 있어도
당신의 곁을 든든히 지켜주는
버팀목 같은 사람`,
`당신이 힘들 때마다
언제나 따뜻하게 감싸주는
포근하고 정겨운 사람`,
`함께 있으면 행복한,
마음편히 웃으며 이야기할 수 있는
편안하고 즐거운 놀이터같은 사람`,
`진솔한 이야기를 들어주고
당신의 이야기에 공감해주는
마음이 넉넉한 호수같은 사람`];
let text_8_1 = `그 사람과 함께했던
소중한 추억이 있나요?`;
let text_8_2 = `15초간 소중한 추억을 떠올려봅시다.`;
let text_9 = `충분히 생각하셨다면,
다음으로 넘어가 주세요`;
let text_10 = `떠올린 추억의 공간은
어떤 분위기였나요?`;
let text_11 = `그 공간에서 5분간 그 사람과
대면한다면 당신은 무엇을 하게될까요?`;
let text_12 = `그 사람에게 꼭 전해야 할
마지막 메시지가 있다면 어떤 내용일까요?`;
let text_13_1 = `생각을 곱씹어보며
그 사람에게 남길 메세지를 적어주세요.`;
let text_13_2 = `단락을 터치하여 글을 써주세요`;
let text_14 = `당신은 저에게`;
let text_15 = '입니다.';
let text_16 = '메시지를 캡쳐해서 마음을 전하세요';
let text_17 = `당신의 5분은
얼마나 소중했나요?`;
let text_18 = `죽음을 앞둔 5분이라는 시간동안
당신은 어떤 생각을 하셨나요?

‘마지막’이라는 단어가
당신의 주변 사람과 당신의 일상을
더욱 소중하게 만들어주지 않았나요?

memento는 진솔하게 쓰여질
여러분의 ‘마지막’ 이야기를
소중하게 보관하고 전달합니다.

memento의 이야기가 궁금하시다면

‘사전예약하기’ 버튼을 눌러보세요!`;
let text_19 = `소중한 사람에게 5분을 선물하세요.`;
let text_20 = `당신에게 주어진 5분이
지났습니다.`;
let text_21 = `진솔한 이야기를 전하기에,
5분이라는 시간이 부족하지 않았나요?

하지만 죽음은
5분이라는 시간조차
당신에게 남겨주지 않습니다.

memento는 언젠가 다가올
당신의 마지막 이야기를 전달합니다.

여러분의 이야기를
소중한 이들에게 남겨두고 싶다면

‘사전예약하기’ 버튼을 눌러보세요!`;
let text_22 = `아직 테스트가 남았다면
자유롭게 진행해주세요.`;

let vibe_text = ['조용한', '포근한', '활기찬', '설레는'];
let act_text = ['진솔한 이야기', '말 없는 포옹', '덤덤한 위로', '눈물 섞인 인사'];
let story_text_1 = ['미안하다는 이야기', '사랑한다는 이야기', '행복했다는 이야기', '위로의 이야기'];
let story_text_2 = [`오랜 시간 전하지 못한
가장 어려운 말 '미안합니다'`,
`소중한 사람에게 전하는
자연스러운 문장 '사랑합니다'`,
`당신과 함께 보낸 시간에 대한
감사의 말 '행복했습니다'`,
`남겨질 사람을 위한 당신의
먹먹한 토닥임 '울지말아요'`];
let message_capture = `메시지 캡쳐하기 >`;
let copy_link = `링크 복사하기 >`;
let edit_message = `< 메시지 수정하기`;
let passive_capture = `수동으로 캡쳐하기 >`;
let passive_capture_text = `자동 캡쳐가 작동 하지 않은 경우 브라우저의
문제일 수 있으니 수동 캡쳐를 이용해주세요.`;
let capture_text = `5초 후 메인 화면으로 돌아갑니다.
사이의 시간에 수동 캡쳐를 진행해 주세요`;


let person_text = ['든든한 사람', '포근한 사람', '즐거운 사람', '넉넉한 사람'];

let text_1_3 = `죽기전에 5분의 시간이 주어진다면,
누굴 위해 이야기를 남기고 싶나요?`;

let sound_ref = `Kevin MacLeod의 Mesmerize에는 크리에이티브
커먼즈 저작자 표시 4.0 라이선스가 적용됩니다.
https://creativecommons.org/licenses/by/4.0/
출처:
http://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500005
아티스트:
http://incompetech.com/`;

let first_time = 1;
let button_select_1 = 1;
let button_select_1_before = 1;
let button_select_2 = 1;
let button_select_2_before = 1;
let button_select_2_changed = true;
let button_select_3 = 1;
let button_select_3_before = 1;
let button_select_3_dir = 2;
let button_select_4 = 0;

let audio1 = new Audio("https://docs.google.com/uc?export=open&id=18IVJXH24qAnWM72ma9ktkEJrg9_kg9lO");
audio1.loop = true; // 반복재생하지 않음
audio1.volume = 0.5; // 음량 설정

function save_As(uri:string, filename:string) {
  let link = document.createElement('a');
  if(typeof link.download === 'string') {
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

function Survey() {

  let [click_start, setclick_start] = React.useState<boolean>(false);
  let [click_1st, setclick_1st] = React.useState<boolean>(false);
  let [click_2nd, setclick_2nd] = React.useState<boolean>(false);
  let [click_3rd, setclick_3rd] = React.useState<boolean>(false);
  let [click_4th, setclick_4th] = React.useState<boolean>(false);
  let [click_4th_2, setclick_4th_2] = React.useState<boolean>(false);
  let [click_5th, setclick_5th] = React.useState<boolean>(false);
  let [click_6th, setclick_6th] = React.useState<boolean>(false);
  let [click_7th, setclick_7th] = React.useState<boolean>(false);
  let [click_9th, setclick_9th] = React.useState<boolean>(false);
  let [click_10th, setclick_10th] = React.useState<boolean>(false);
  let [go_back_test, setgo_back_test] = React.useState<boolean>(false);
  let [displaynone, setdisplaynone] = React.useState<boolean>(false);
  let [displaynone_9th, ] = React.useState<boolean>(false);
  let [displaynone_10th, setdisplaynone_10th] = React.useState<boolean>(false);
  let [time_start, settime_start] = React.useState<boolean>(false);
  let [check_capture, setcheck_capture] = React.useState<boolean>(false);
  let [check_copy, setcheck_copy] = React.useState<boolean>(false);
  let [passive_capture_hide, setpassive_capture_hide] = React.useState<boolean>(false);
  let [passive_capture_hide_text, setpassive_capture_hide_text] = React.useState<boolean>(false);
  let [back_message, setback_message] = React.useState<boolean>(false);
  let [sound_click, setsound_click] = React.useState<boolean>(false);

  let [message, setmessage] = React.useState('');
  let url = 'https://mymemento.kr/survey';

  let time = LiveTimeContainer();
  let real_time = time - first_time;

  let minute = (real_time - (real_time%60))/60;
  let second = real_time % 60;

  return (
    <>
      <div className = 'phone'>
          <div className = 'main'>
              <div className = 'main_image'>
                  <div className = {'image_1' + (click_start ? ' click' : '') + (click_1st ? ' click_1st' : '')}>
                      <img src = {imageUrl('survey/image_1.png')} />
                  </div>
              </div>

              <div className = {'main_page_displaynone' + (click_start ? ' click' : '')}>
                  <div className = {'main_1'}>
                      <p>{main_1}</p>
                  </div>
                  <div className = {'main_2'}>
                      <p>{main_2}</p>
                  </div>
                  <div className = {'vector'}>
                      <img src = {imageUrl('survey/vector.png')} />
                  </div>
                  <div className = {'text_1'}>
                      <p>{text_1}</p>
                  </div>
                  <div className = {'text_2'}>
                      <p>{text_2}</p>
                  </div>
              </div>

              <div className = {'vector1' + (click_start ? ' click' : '')}>
              <img src = {imageUrl('survey/vector1.png')} />
              </div>

              <div className = {'vector1_later' + (click_start ? ' click' : '') + (click_1st ? ' click_1st' : '') + (click_9th ? ' click_9th' : '')}>
              </div>

              <div className = {'Start_button' + (click_start ? ' click' : '')} onClick={() => {
                audio1.play();
                setclick_start(!click_start);
              }}>
                  <div className = 'text'> 시작하기 </div>
              </div>

              <div className = {'next_button' + (click_start ? ' click' : '') + (click_1st ? ' click_1st' : '')} onClick={() => {setclick_1st(!click_1st);
                first_time = time; settime_start(true);}}>
                  <div className = 'text'> 다음 {'>'} </div>
              </div>

                <div className = {'text_3' + (click_start ? ' click' : '') + (click_1st ? ' click_1st' : '')}>
                <textarea value =  {text_3} disabled> </textarea>
                </div>

                <div className = {'sound' + (click_start ? ' click' : '') + (click_1st ? ' click_1st' : '') + (click_10th ? ' click_10th' : '')} onClick = {() => {setsound_click(!sound_click);}}>
                    <img src = {imageUrl('survey/sound.png')} />
                </div>
                <div className = {'sound_ref_backgroud' + (sound_click ? ' clicked' : '') + (click_1st ? ' click_1st' : '')} />
                <div className = {'sound_ref' + (sound_click ? ' clicked' : '') + (click_1st ? ' click_1st' : '')}>
                    <textarea value = {sound_ref} disabled />
                </div>
          </div>

          <div className = {'message_record' + (click_6th ? ' click_6th' : '')}>
          <textarea className = 'message_record_data' value={message} disabled/>
          </div>

          <div className = {'back_ground' + (click_1st ? ' click_1st' : '') + (click_9th ? ' click_9th' : '')}>
              <img src = {imageUrl('survey/back_ground.png')} />
          </div>

          <div className = {'who_is_your_precious_person' + (click_1st ? ' click_1st' : '') + (click_2nd ? ' click_2nd' : '')}>
              <div className = {'text_back_precious'}>
                  <img src = {imageUrl('survey/text_back_precious.png')} />
              </div>
              <div className = {'text_4'}>
                  <textarea value = {text_4} disabled/>
              </div>

              <div className = {'fade_in_slow' + (click_1st ? ' click_1st' : '')}>
                <div className = {'quote'}> <img src = {imageUrl('survey/quote.png')} /> </div>
                <div className = {'answer_1'} onClick = {() => {setclick_2nd(true);}}>
                    { [...Array(6).keys()].map((i) => (
                        <div className = {`answer_1_${i + 1}`}>
                            <div className = 'text'> {answer_1[i]} </div>
                        </div>
                    )) }
                </div>
              </div>
          </div>

          <div className = {'person_page' + (click_2nd ? ' click_2nd' : '') + (click_3rd ? ' click_3rd' : '')}>
              <div className = {'text_back_person'}>
                  <img src = {imageUrl('survey/text_back_person.png')} />
              </div>
              <div className = {'text_5'}>
                  <textarea className = 'text_5_1' value = {text_5_1} disabled />
                  <p className = 'text_5_2'>{text_5_2}</p>
              </div>

              <div className = 'image_3'>
                  { [...Array(4).keys()].map((i) => (
                      <div className = {`image_3_${i + 1}` + ((`${button_select_1}` === `${i+1}`) ? ' selected' : ' not')}>
                          <img className = 'normal' src = {imageUrl(`survey/image_3_${i + 1}.png`)} />
                      </div>
                  )) }
                  { [...Array(4).keys()].map((i) => (
                      <div className = {`image_3_${i + 1}_shadow` + ((`${button_select_1}` === `${i+1}`) ? ' selected' : ' not')}>
                          <img className = 'shadow' src = {imageUrl(`survey/image_3_${i + 1}_shadow.png`)} />
                      </div>
                  )) }
              </div>

              { [...Array(4).keys()].map((i) => (
                  <div className = {`button_${i+1}`} onClick = {() => {button_select_1_before = button_select_1; button_select_1 = (i+1);}}>
                      <img src = {imageUrl('survey/button.png')} />
                  </div>
              )) }

              <div className = {'button_select' + ` button_select_${button_select_1_before}_${button_select_1}`}>
                  <img src = {imageUrl('survey/button_select.png')} />
              </div>


              <div className = 'image_2'>
                  { [...Array(4).keys()].map((i) => (
                      <div className = {`image_2_${i + 1}` + ((`${button_select_1}` === `${i + 1}`) ? ' selected' : ' not')}>
                          <img className = 'image' src = {imageUrl(`survey/image_2_${i+1}.png`)} />
                      </div>
                  )) }
              </div>

              <div className = {'image_border'}>
              <img src = {imageUrl(`survey/image_border.png`)} />
              </div>

              { [...Array(4).keys()].map((i) => (
                  <div className = {`text_6_${i + 1}` + ((`${button_select_1}` === `${i + 1}`) ? ' selected' : ' not')}>
                      <p>{text_6[i]}</p>
                  </div>
              )) }

              { [...Array(4).keys()].map((i) => (
                  <div className = {`text_7_${i + 1}` + ((`${button_select_1}` === `${i + 1}`) ? ' selected' : ' not')}>
                      <textarea value = {text_7[i]} disabled> </textarea>
                  </div>
              )) }

              <div className = {'next_button_3rd'} onClick={() => {setclick_3rd(!click_3rd);}}>
                  <div className = 'text'> 다음 {'>'} </div>
              </div>
          </div>

          <div className = {'timer_page' + (click_3rd ? ' click_3rd' : '') + (click_5th ? ' click_5th' : '')}>
            <div className = {'text_back_timer'}>
                <img src = {imageUrl('survey/text_back_timer.png')} />
            </div>
            <div className = {'timer_dot' + (click_4th ? ' click_4th' : '')}>
                <img src = {imageUrl('survey/timer_dot.png')} />
            </div>
            <div className = {'shadow' + (click_4th ? ' click_4th' : '')}>
                <img src = {imageUrl('survey/shadow.png')} />
            </div>
            <div className = {'timer' + (click_4th ? ' click_4th' : '')}>
                <img src = {imageUrl('survey/timer.png')} />
            </div>
            <div className = {'text_8'}>
                <textarea className = 'text_8_1' value = {text_8_1} disabled />
                <p className = 'text_8_2'>{text_8_2}</p>
            </div>
            <div className = {'timer_15s'+ (click_4th ? ' click_4th' : '')} onClick = {() => {setclick_4th(true); setTimeout( () => {setclick_4th_2(!click_4th_2)},15000);}}>
                <div className = 'text'> 15초 시작 </div>
            </div>
            <div className = {'text_9' + (click_4th_2 ? ' click_4th' : '')}>
                <textarea className = 'text_9' value = {text_9} disabled />
            </div>
            <div className = {'next_button_5th' + (click_4th_2 ? ' click_4th' : '')} onClick = {() => {setclick_5th(!click_5th);}}>
                <div className = 'text'> 다음 {'>'} </div>
            </div>
          </div>

          <div className = {'vibe_page' + (click_5th ? ' click_5th' : '') + (click_6th ? ' click_6th' : '')}>
            <div className = {'text_back_vibe'}>
                <img src = {imageUrl('survey/text_back_vibe.png')} />
            </div>
            <div className = 'text_10'>
                <textarea value = {text_10} disabled />
            </div>
            <div className = 'vibe_image'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`vibe_${i + 1}` + ((`${button_select_2}` === `${i+1}`) ? ' selected' : ' not')} onClick = {() => {button_select_2_before = button_select_2; button_select_2 = (i+1); button_select_2_changed = ((button_select_2 !== button_select_2_before) ? !button_select_2_changed : button_select_2_changed)}} >
                    <img className = 'image' src = {imageUrl(`survey/vibe_${i+1}.png`)} /> </div>
              )) }
            </div>
            <div className = 'vibe_text'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`vibe_text_${i + 1}` + ((`${button_select_2}` === `${i+1}`) ? ' selected' : ' not')}>
                      <p>{vibe_text[i]}</p>
                  </div>
              )) }
            </div>
            <div className = {'image_selector'}>
                <div className = {`image_selector_${button_select_2_before}` + ` delta_${button_select_2 - button_select_2_before}` }>
                    <img src = {imageUrl('survey/image_selector.png')} />
                </div>
            </div>
            <div className = {'next_button_6th'} onClick = {() => {setclick_6th(!click_6th);}}>
                <div className = 'text'> 다음 {'>'} </div>
            </div>
          </div>

          <div className = {'act_page' + (click_6th ? ' click_6th' : '') + (click_7th ? ' click_7th' : '')}>
            <div className = {'text_back_act'}>
                <img src = {imageUrl('survey/text_back_act.png')} />
            </div>
            <div className = 'text_11'>
                <textarea value = {text_11} disabled />
            </div>
            <div className = 'act_text'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`act_text_${i + 1}` + ((`${button_select_3}` === `${i+1}`) ? ' selected' : ' not')} onClick = {() => {button_select_3_before = button_select_3; button_select_3 = (i+1); button_select_3_dir = (((button_select_3 > button_select_3_before)) ? 1 : (((button_select_3 === button_select_3_before)) ? button_select_3_dir : 0)); }}>
                      <textarea value = {act_text[i]} disabled/>
                  </div>
              )) }
            </div>
            <div className = 'act_image'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`act_image_${i + 1}` + ((`${button_select_3}` === `${i+1}`) ? ` selected_${button_select_3_dir}` : ` not_${button_select_3_dir}` + ((`${button_select_3_before}` === `${i+1}`) ? ' before' : ''))}>
                      <img className = 'image' src = {imageUrl(`survey/act_image_${i+1}.png`)} />
                  </div>
              )) }
            </div><div className = 'text_select_dot'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`text_select_dot_${i + 1}` + ((`${button_select_3}` === `${i+1}`) ? ' selected' : ' not')}>
                      <div className = 'dot' />
                  </div>
              )) }
            </div>
            <div className = {'next_button_7th'} onClick = {() => {setclick_7th(!click_7th);}}>
                <div className = 'text'> 다음 {'>'} </div>
            </div>
          </div>

          <div className = {'story_page' + (click_7th ? ' click_7th' : '') + (button_select_4 ? ' click_8th' : '')}>
            <div className = {'text_back_story'}>
                <img src = {imageUrl('survey/text_back_story.png')} />
            </div>
            <div className = {'text_12'}>
                <textarea value = {text_12} disabled />
            </div>
            <div className = 'story'>
              { [...Array(4).keys()].map((i) => (
                  <div className = {`story_${i + 1}`} onClick = {() => {button_select_4 = (i+1);}}>
                      <img src = {imageUrl(`survey/story_${i+1}.png`)} />
                      <p>{story_text_1[i]}</p>
                      <textarea value = {story_text_2[i]} disabled />
                  </div>
              )) }
            </div>
          </div>


          <div className = {'message_write_page' + (button_select_4 ? ' click_8th' : '') + (click_9th ? ' click_9th' : ' not') + (displaynone_9th ? ' displaynone_9th' : '')}>
              <div className = {'text_back_message'}>
                  <img src = {imageUrl('survey/text_back_message.png')} />
              </div>
              <div className = {'text_13'}>
                  <textarea className = 'text_13_1' value = {text_13_1} disabled />
                  <p className = 'text_13_2'>{text_13_2}</p>
              </div>
              <div className = {'message_line'}>
                  { [...Array(6).keys()].map((i) => (
                    <div className = {`message_line_${i + 1}`}>
                    <img src = {imageUrl('survey/message_line.png')} />
                    </div>
                  )) }
                  <div className = 'message_line_7'>
                      <img src = {imageUrl('survey/message_line_2.png')} />
                  </div>
              </div>
              <div className = 'message_button' onClick = {() => {setclick_9th(true);
                setdisplaynone_10th(false);
                setback_message(false);
              const message_elem : HTMLElement = document.querySelector('.message_record_data') as HTMLElement;
              const img : HTMLImageElement = document.querySelector('.message_image') as HTMLImageElement;
              domtoimage.toBlob(message_elem).then((blob) => {
                let reader = new FileReader();
                reader.onload = (e) => {
                  img.src = String(reader.result);
                  console.log(img.src);
                }
                reader.readAsDataURL(blob);
              })}}>
                  <div className = 'text'> 메시지 확인 </div>
              </div>
              <div className = 'message_box'>
                  <form method = "post">
                  <textarea className = 'message_data' placeholder='소중한 이에게 마음을 전해보세요.' autoComplete='message' onChange={(e) => { setmessage(checkline(e.target.value));}} value={message}/>
                  </form>
              </div>
          </div>

          <div className = {'timer_clock' + ((click_1st && !click_10th) ? ' click' : '') + ((real_time >= 299 && click_start) ? ' timeover' : '') + (click_9th ? ' click_9th' : '') + (back_message ? ' back_message' : '')}>
          <div className = {'Minute'}>‘ Memento mori ’</div>
          </div>

          <div className = {'message_page' + (click_9th ? ' click_9th' : '') + (back_message ? ' back_message' : '') + (click_10th ? ' click_10th' : '') + (displaynone_10th ? ' displaynone_10th' : '')}>
            <div className = {'capture'}>
                <div className = 'message_background'>
                    <img src = {imageUrl(`survey/message_background_${button_select_4}.png`)} />
                </div>
                <div className = 'message_logo_background'>
                    <img src = {imageUrl(`survey/message_logo_background.png`)} />
                </div>
                <div className = 'message_logo'>
                    <img src = {imageUrl(`survey/message_logo_${button_select_4}.png`)} />
                </div>
                <div className = 'dot'>
                </div>
                <div className = 'text_14'>
                    <p>{text_14}</p>
                </div>
                <div className = 'person_logo'>
                    <img src = {imageUrl(`survey/person_logo_${button_select_1}.png`)} />
                </div>
                <div className = 'vector_2'>
                </div>
                <div className = 'person_text'>
                    <p>{person_text[button_select_1 - 1]}</p>
                </div>
                <div className = 'text_15'>
                    <p>{text_15}</p>
                </div>
                <div className = {'vector_6' + (check_capture ? (passive_capture_hide ? ' hide' : ' not') : '')}>
                    <img src = {imageUrl(`survey/vector_6.png`)} />
                </div>
                <div className = {'memento_logo' + (check_capture ? (passive_capture_hide ? ' hide' : ' not') : '')}>
                    <img src = {imageUrl(`survey/message_memento_logo.png`)} />
                </div>
                <div className = 'message_image_div'>
                    <img className = 'message_image'/>
                </div>
            </div>
            <div className = {'nonecapture'}>
                <div className = 'message_background'>
                    <img src = {imageUrl(`survey/message_background_${button_select_4}.png`)} />
                </div>
                <div className = {'message_background_2' + (check_capture ? (passive_capture_hide ? ' hide' : '') : '')}>
                    <img src = {imageUrl(`survey/message_background_${button_select_4}.png`)} />
                </div>
                <div className = 'message'>
                <textarea value={message} disabled/>
                </div>
                <div className = {'before_capture' + (check_capture ? ' captured' : '') + (check_capture ? (passive_capture_hide ? ' hide' : '') : '')}>
                    <div className = 'text_16'>
                        <p>{text_16}</p>
                    </div>
                    <div className = 'vector_3'>
                        <img src = {imageUrl(`survey/vector_3.png`)} />
                    </div>
                    <div className = 'edit_message' onClick = {() => {setclick_9th(false);
                      setback_message(true);
                    setTimeout(()=>{setdisplaynone_10th(true);}, 1000);}}>
                        <p>{edit_message}</p>
                    </div>
                    <div className = {'message_capture'} onClick = {() => {
                      const elem : HTMLElement = document.querySelector('.capture') as HTMLElement;
                      html2canvas(elem).then((canvas) => {
                      save_As(canvas.toDataURL("image/png"), 'image___.png');
                      });
                      setcheck_capture(true);}}>
                        <p>{message_capture}</p>
                    </div>
                </div>
                <div className = {'capture_text' + (passive_capture_hide_text ? ' captured' : ' not')}>
                <textarea value = {capture_text} disabled />
                </div>
                <div className = {'after_capture' + (check_capture ? ' captured' : '') + (check_capture ? (passive_capture_hide ? ' hide' : '') : '')}>
                    <div className = {'next_button_8th'} onClick = {() => {setclick_10th(!click_10th);
                      let timer_out = setInterval(() => {audio1.volume = audio1.volume - 0.01; audio1.play();},200 );
                      setTimeout(() => {clearTimeout(timer_out);}, 9500);}}>
                        <div className = 'text'> 다음 {'>'} </div>
                    </div>
                    <div className = 'vector_9' />
                    <div className = 'passive_capture' onClick = {() => {setpassive_capture_hide(true);
                    setpassive_capture_hide_text(true); setTimeout(() => {
                        setpassive_capture_hide(false);
                    }, 6000);
                    setTimeout(() => {
                        setpassive_capture_hide_text(false);
                    }, 3000);}}>
                        {passive_capture}
                    </div>
                    <div className = 'passive_capture_text'>
                        {passive_capture_text}
                    </div>
                </div>
            </div>
          </div>

          <div className = {'reservation_page' + (click_10th ? ' click_10th' : '')}>
            <div className = 'reservation_background'>
              <img src = {imageUrl(`survey/reservation_background.png`)} />
            </div>
            <div className = 'vector_4'>
            </div>
            <div className = 'text_17'>
                <textarea value = {text_17} disabled/>
            </div>
            <div className = 'text_18'>
                <textarea value = {text_18} disabled/>
            </div>
            <div className = 'vector_5'>
              <img src = {imageUrl(`survey/vector_5.png`)} />
            </div>
            <div className = 'copy_link' onClick = {() => {
              const element = document.createElement('textarea');
              element.value = url;
              element.setAttribute('readonly', '');
              element.style.position = 'absolute';
              element.style.left = '-9999px';
              document.body.appendChild(element);
              element.select();
              document.body.removeChild(element);
              setcheck_copy(true); setTimeout(()=>{setcheck_copy(false);}, 1000);}}>
                <p>{copy_link}</p>
            </div>
            <div className = 'text_19'>
                <p>{text_19}</p>
            </div>
            <div className = 'reserve_button'>
              <ExternalLink href="https://www.mywelldying.com/" >
                  <div className = 'text'> 사전 예약 </div>
              </ExternalLink>
            </div>
            <div className = 'memento_2'>
                <p>memento</p>
            </div>
            <div className = {'check_copy' + (check_copy ? ' copyed' : ' not')}>클립보드에 복사되었습니다.</div>
          </div>

          <div className = {'timeover_page' + ((real_time >= 299 && time_start && !click_9th) ? ' timeover' : '') + (go_back_test ? ' go_back_test' : '') + (displaynone ? ' displaynone' : '')}>
            <div className = 'timeover_background'>
              <img src = {imageUrl(`survey/timeover_background.png`)} />
            </div>
            <div className = 'vector_4'>
            </div>
            <div className = 'text_20'>
              <textarea value = {text_20} disabled> </textarea>
            </div>
            <div className = 'text_21'>
              <textarea value = {text_21} disabled> </textarea>
            </div>
            <div className = 'text_22'>
              <textarea value = {text_22} disabled> </textarea>
            </div>
            <div className = 'go_back_test_button' onClick = {() => {setgo_back_test(!go_back_test); setTimeout( () => {setdisplaynone(true);},1000);}}>
                <div className = 'text'> {'<'} 테스트 이어하기 </div>
            </div>
            <div className = 'reserve_button'>
              <ExternalLink href="https://www.naver.com" >
                  <div className = 'text'> 사전 예약 </div>
              </ExternalLink>
            </div>
          </div>

      </div>


      <div className = {'non_phone'}>
          <div className = {'back_ground_nonphone'}>
              <img src = {imageUrl('survey/back_ground_nonphone.png')} />
          </div>
          <div className ={'memento_logo'}>
              <img src = {imageUrl('survey/message_memento_logo.png')} />
          </div>
          <div className = {'vector_7'} />
          <div className = 'text_1_1'>
              <p>소중한 이를 떠올리는 5분간의 생각</p>
          </div>
          <div className = 'content'>
              <div className = 'Smartphone_image'>
                  <img src = {imageUrl('survey/Smartphone_image.png')} />
              </div>
              <div className = {'vector_8'} />
              <div className = 'text_1_2'>
                  <p>당신에게 주어진 5분</p>
              </div>
              <div className = 'text_1_3'>
                  <textarea value = {text_1_3} disabled>
                  </textarea>
              </div>
              <div className = 'rectangle' />
              <div className = 'QR_code'>
              <img src = {imageUrl('survey/QR_code.png')} />
              </div>
              <div className = 'text_1_4'>
                  <p className = 'head'>휴대폰 QR 코드</p>
                  <p className = {'main' + 'a'}>휴대폰으로 QR코드를 스캔하여</p>
                  <p className = {'main' + 'b'}>최적화된 모바일 환경에서 이용하세요.</p>
                  <p className = 'detail'>(기본 카메라에 QR 코드를 인식해주세요)</p>
              </div>
          </div>
      </div>

      <script src="./node_modules/jquery/dist/jquery.min.js"></script>
      <script src="./node_modules/html2canvas/dist/html2canvas.min.js"></script>
      <script src="./node_modules/canvas2image-master/canvas2image.js" />
    </>
  );
}

export default Survey;
