# SPEECH MATE - 프론트 앤드 파트

voice pitch detection 알고리즘을 적용한 음성 녹음 웹 앱

👄[Speech Mate Demo](https://speechmate.online)<br/>
📚 [백엔드 Repository](https://github.com/speech-mate/speech-mate-backend)

## 스피치 메이트 소개

플래시 카드에 키워드를 적어 한장 한장 넘기며 연습을 하는 제 오랜 습관에서 출발한 프로젝트입니다. 녹음과 플래시카드가 결합된 기능을 구현해 보고 싶었고, 입력되는 오디오 신호를 좀 더 적극적으로 활용할 수 있는 방법이 있을까 고민하다가 Web Audio API를 사용한 voice pitch 분석 기능을 추가하여 프로젝트를 기획하게 되었습니다.

## 개요

### ⏰작업기간

2022년 02월 21일 ~ 2022년 03월 13일

<details>
<summary>세부 작업 내용</summary>
  
  #### week 1 - 기획 및 설계
  - 아이디어 검토 및 기술 검증
  - [목업](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FLqGEAuC84lL8E4FdYhVgcc%2FUntitled%3Fnode-id%3D0%253A1) 작성 및 [DB 스키마](https://lucid.app/lucidchart/7c4d1144-989c-4b54-9b60-01db0f0ec299/edit?invitationId=inv_6a140949-ab65-4e07-9455-42f002d59ca0) 모델링
  - [테스크 카드](https://nebula-cemetery-b32.notion.site/bc2a53e91cde4294856888e5b38fc6dc?v=cc148201de2a4782920edae951a023a4) 작성
  #### week 2,3 - 기능 개발
  - 프론트앤드
    - 카카오 소셜 로그인 구현
    - 메인 페이지 구현
    - pitch detecting 로직 구현 (autocorrelation 알고리즘)
    - 스피치 연습 페이지 구현
    - 스피치 리뷰 페이지 구현
    - 저장된 스피치 페이지 구현
  - 벡앤드
    - auth API 작성
    - users API 작성
    - multer-s3를 사용한 audio file 서버 업데이트 미들웨어 작성
  - 배포 및 피드백 반영
    - 낮은 음역대 note 추가 (남성 목소리 대응)
    - 스피치 설정 단계에서 입력한 소주제 삭제 기능 추가
    - 실시간 voice pitch 반영 throttle 활용
  - 테스트 코드 작성
</details>

### ⚙ 기술스택

### Language : <img alt="JavaScript" src ="https://img.shields.io/badge/JavaScript-F7DF1E.svg?&style=for-the-appveyor&logo=JavaScript&logoColor=white"/>, <img alt="html" src ="https://img.shields.io/badge/HTML5-E34F26?style=for-the-appveyor&logo=html5&logoColor=white"/>, <img alt="css" src ="https://img.shields.io/badge/CSS3-1572B6?style=for-the-appveyor&logo=css3&logoColor=white"/>

### Deploy : [![Netlify Status](https://api.netlify.com/api/v1/badges/faed8515-3d04-4635-866b-76a066b5ff9b/deploy-status)](https://app.netlify.com/sites/musing-wozniak-47cc96/deploys)

### Frontend : <img alt="React" src ="https://img.shields.io/badge/React-61DAFB.svg?&style=for-the-appveyor&logo=React&logoColor=white"/> , <img alt="styled-components" src ="https://img.shields.io/badge/styled_components-DB7093.svg?&style=for-the-appveyor&logo=styled-components&logoColor=white"/> , <img alt="axios" src ="https://img.shields.io/badge/axios-764ABC.svg?&style=for-the-appveyor&logo=axios&logoColor=white"/>

## 🛠주요기능

|     페이지      |          기능          |                                                                                                                                                                                                     설명                                                                                                                                                                                                      |
| :-------------: | :--------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|      Login      |      사용자 동의       |                                                                                                                                                     카카오 소셜 로그인을 사용하여 사용자의 개인 정보(이메일, 닉네임, 프로필) 사용에 대한 동의를 얻습니다.                                                                                                                                                     |
|  New Practice   |    스피치 목적 선택    |                                                               스피치의 목적을 선택할 수 있고, 각 목적은 아래와 같이 특정 음계와 매핑되어 있습니다.<br/><li>도 : 위로, 힘든 일 말할 때</li><br/><li>레 : 회의, 보고제안, 권유</li><br/><li>미 : 일상 대화</li><br/><li>파 : 연설, 프레젠테이션 주장 강조</li><br/><li>솔 : 인사, 칭찬, 감사</li>                                                               |
|                 | 사용자 기본 pitch 분석 |                                                                                                               사용자가 평상시 말하는 톤을 주파수로 변환하여 가장 가까운 음계의 주파수를 state에 저장합니다. 동시에 해당 음계의 앞, 뒤 2개의 노트와 함께 총 5개의 노트 또한 state에 저장합니다.                                                                                                                |
|                 |  스피치 세부사항 설정  |                                                                                                     스피치 시간, 주제, 소주제를 설정할 수 있습니다. 스피치 시간은 10분을 초과할 수 없으며, 소주제를 설정하기 위해서는 반드시 먼저 스피치 시간이 설정 되어야 합니다. 작성한 소주제는 삭제 할 수 있습니다.                                                                                                      |
|                 |      스피치 녹음       |                       사용자는 녹음 중 실시간으로 분석된 pitch와 가장 가까운 음계를 확인할 수 있습니다. 스피치 목적에 맞는 톤의 경우에는 초록색, 그렇지 않는 경우에는 구분되어 건반에 표시됩니다. 녹음은 일시정지 재개 기능이 있으며, 설정한 시간보다 이전에 녹음을 종료할 수 있습니다. 또한 녹음중에는 세부사항에서 설정한 소주제가 있는 경우 설정 시간에 맞추어 소주제가 변경됩니다.                        |
|     Review      |      스피치 결과       | 스피치 결과 페이지에서는 스피치 목적 음계, 가장 많이 입력된 음계를 확인할 수 있고, 녹음된 음성을 다시 들을 수 있는 기능이 있습니다. 또한 음성을 들으며 설정한 소주제가 전부 커버되었는지 체크하는 기능이 있습니다. 우측 상단에 분석 결과 버튼을 누른 경우 voice pitch detecting 결과에 따라 10가지의 각기 다른 팁을 제공받을 수 있습니다. 원하는 음성 파일은 저장하여 다른 디바이스에서도 확인할 수 있습니다. |
| Saved Practices |      저장된 파일       |                                                                                                                      Review 페이지에서 저장한 파일들이 리스트업 되어 있습니다. 각 파일을 클릭하게 되면 리뷰 페이지로 이동하게 됩니다. 더이상 리뷰가 필요 없는 파일은 삭제할 수 있습니다.                                                                                                                      |

<details>
<summary>상세 화면 이미지</summary>

### 로그인

![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/80205036/158477076-4f9ab86c-2b8f-4f4f-8436-3415dc763e28.gif)
<br/>

### 스피치 목적 선택 & 중간 pitch 분석

![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/80205036/158477292-7b33934c-54f4-4ae5-b866-40ed39b95535.gif)
<br/>

### 스피치 상세 설정

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/80205036/158477610-08ab2636-731c-4862-90f1-50be73d060f6.gif)
<br/>

### 스피치 녹음 시작

![ezgif com-gif-maker (4)](https://user-images.githubusercontent.com/80205036/158477745-f5f12799-cf5c-4865-b477-bf25ce5bc63c.gif)
<br/>

### 스피치 녹음 종료

![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/80205036/158477989-db32091c-0023-4726-9fe0-ec4a251eb640.gif)
<br/>

### 스피치 리뷰 및 저장

![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/80205036/158478175-5b1f7f1c-cd90-4497-a4e6-fd4c6c1900a9.gif)

</details>

## 🚀 Challenges

<details>
<summary>Pitch Detection 알고리즘에 ACF를 적용하기 까지</summary>
<br/>
프로젝트 기획 관련하여 Pitch Detecting에 대한 리서치를 하던 중 Auto Correlation Function(이하 ACF)을 이용한 알고리즘이 보편적으로 쓰이고 있다는 사실을 알게 되었습니다. 처음에는 Web Audio API와 그 메소드들을 잘 활용하면 간단하게 주파수를 산출해낼 수 있을 것 같았는데, 왜 이름도 어려운 알고리즘을 따로 적용해서 주파수를 구하는 걸까? 의문을 가지고 리서치를 이어 나갔습니다. 단순 리서치 후, ACF가 Best Practice 인 것 같으니 해당 부분만 공부해서 적용해보자는 생각이 먼저 들었습니다. 왜냐하면 2주라는 한정적인 개발 기간동안 알고리즘 구현 뿐만 아니라 그 알고리즘을 활용한 어플리케이션 전체를 혼자 만들어야 했기 때문에 시간 절약기 필요하다고 생각했기 때문입니다. 
<br/>
<br/>
그러나 이내 생각을 바꾸게 되었습니다. Best Practice를 따라가면 개발이 조금 더 용이해지겠지만, 왜 그것이 널리 쓰이고 있는지 그 이유를 알지 못한채 쓴다면 제가 가진 의문점은 영영 해소될 수 없다고 생각했기 떄문입니다. 프로젝트를 마무리하는 이 시점에서 돌이켜보면 바로 ACF에 대한 공부를 했다고 하더라도, 음성 신호와 그 데이터의 해석에 대한 이해도가 매우 낮은 상태였기 때문에 결국에는 지금과 같이 전체적으로 공부하며 프로젝트를 진행했을 것 같다는 생각이 듭니다.
<br/>
<br/>
이번 프로젝트를 통틀어서 가장 새로운 것을 많이 알게된 분야가 바로 오디오 신호인 만큼 아래 글들은 제가 어떤 순서로 오디오 신호를 이해해 나갔고, 어떠한 알고리즘들이 고려 되었으며, 왜 최종적으로 ACF가 채택 되었는지에 대한 과정이 정리되어 있습니다.
<br/>
<br/>

#### [0️⃣ 소리에 대한 기본적인 이해](https://nebula-cemetery-b32.notion.site/22ee3790bcc440139249d894f7b6a54a)

#### [1️⃣ 브라우저가 소리를 인식하게 해보자](https://nebula-cemetery-b32.notion.site/3e3ee3ba678146018e86462cedd56e65)

#### [2️⃣ Web Audio API의 활용 방안](https://nebula-cemetery-b32.notion.site/Web-Audio-API-b2d4d5ca34ac498b859daec5fb73646d)

#### [3️⃣ Pitch Detection 알고리즘 구현 (1) - Zero Crossing](https://nebula-cemetery-b32.notion.site/Pitch-Detection-1-Zero-Crossing-f0a6356ecbbc4f14a3a6680af2721056)

#### [4️⃣ Pitch Detection 알고리즘 구현 (2) - Fast Fourier Transform](https://nebula-cemetery-b32.notion.site/Pitch-Detection-2-Fast-Fourier-Transform-0c48dd6ad3bb40e7afecfc961b130f9d)

#### [5️⃣ Pitch Detection 알고리즘 구현 (3) - Auto Correlation Function](https://nebula-cemetery-b32.notion.site/Pitch-Detection-3-Auto-Correlation-Function-862a6748ca44428e89bb3a0e2c08a9ac)

</details>

## 💬프로젝트를 마친 소감

TODO 2
