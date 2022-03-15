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
|페이지|기능|설명|
|:---:|:---:|:---:|
|Login|사용자 동의|카카오 소셜 로그인을 사용하여 사용자의 개인 정보(이메일, 닉네임, 프로필) 사용에 대한 동의를 얻습니다.|
|New Practice|스피치 목적 선택|스피치의 목적을 선택할 수 있고, 각 목적은 아래와 같이 특정 음계와 매핑되어 있습니다.<br/><li>도 : 위로, 힘든 일 말할 때</li><br/><li>레 : 회의, 보고제안, 권유</li><br/><li>미 : 일상 대화</li><br/><li>파 : 연설, 프레젠테이션 주장 강조</li><br/><li>솔 : 인사, 칭찬, 감사</li> |
||사용자 기본 pitch 분석|사용자가 평상시 말하는 톤을 주파수로 변환하여 가장 가까운 음계의 주파수를 state에 저장합니다. 동시에 해당 음계의 앞, 뒤 2개의 노트와 함께 총 5개의 노트 또한 state에 저장합니다.|
||스피치 세부사항 설정|스피치 시간, 주제, 소주제를 설정할 수 있습니다. 스피치 시간은 10분을 초과할 수 없으며, 소주제를 설정하기 위해서는 반드시 먼저 스피치 시간이 설정 되어야 합니다. 작성한 소주제는 삭제 할 수 있습니다.|
||스피치 녹음|사용자는 녹음 중 실시간으로 분석된 pitch와 가장 가까운 음계를 확인할 수 있습니다. 스피치 목적에 맞는 톤의 경우에는 초록색, 그렇지 않는 경우에는 구분되어 건반에 표시됩니다. 녹음은 일시정지 재개 기능이 있으며, 설정한 시간보다 이전에 녹음을 종료할 수 있습니다. 또한 녹음중에는 세부사항에서 설정한 소주제가 있는 경우 설정 시간에 맞추어 소주제가 변경됩니다.|
|Review|스피치 결과|스피치 결과 페이지에서는 스피치 목적 음계, 가장 많이 입력된 음계를 확인할 수 있고, 녹음된 음성을 다시 들을 수 있는 기능이 있습니다. 또한 음성을 들으며 설정한 소주제가 전부 커버되었는지 체크하는 기능이 있습니다. 우측 상단에 분석 결과 버튼을 누른 경우 voice pitch detecting 결과에 따라 10가지의 각기 다른 팁을 제공받을 수 있습니다. 원하는 음성 파일은 저장하여 다른 디바이스에서도 확인할 수 있습니다.|
|Saved Practices|저장된 파일|Review 페이지에서 저장한 파일들이 리스트업 되어 있습니다. 각 파일을 클릭하게 되면 리뷰 페이지로 이동하게 됩니다. 더이상 리뷰가 필요 없는 파일은 삭제할 수 있습니다.|


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

## 🚀 Issue Log
TODO 1

## 💬프로젝트를 마친 소감
TODO 2
