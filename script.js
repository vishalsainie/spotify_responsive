console.log('lets write javascript');

let currsong = new Audio();    // currsong is ek element jo khud hi update hota rhega i.e har baar ek new audio nahi banega taaki jispe click kre bas vahi song chale and koi or pause ho jaye isliye

let songs;       // global variable
let currfolder;     // jo bhi curr folder khula hoga vo isme aa jaega.

// agar hum 127.0.0.1:3000/songs me jata hu to mere saare downloaded songs jo ki folder me hai vo show kr dega ye..............ye dhyan me rakhna kaise folders and cheeze access krte hai chrome ya brave pe..........bahut kaam aegi ye cheeze

// function to get all our songs in our array 
// ye ab ek apne folder ko lega and uss folder ke corresponding jo bhi songs hai usko load krdega hamari playlist me
async function getSongs(folder) {
    currfolder = folder;    // ghuste hi getsongs vale fn me currfolder ko update krdo folder se......jispe bhi click kre.

    // pehle hum apne songe fetch krenge using fetch api, and convert it to text form
    let a = await fetch(`/${folder}/`);
    let response = await a.text();        // songs mil gye in the form of tables

    // ab hum saare links ko nikalenge and apne ek songs[] array me push kr denge

    // ab ek div create krenge and uska inner html replace krenge by response.....i.e tables se
    let div = document.createElement("div");
    div.innerHTML = response;

    // ab apne paas ek div aa gaya hai jisme saare songs hai table ki form me to ab uss table me se elements nikalenge jo ki 'a' honge.........jo o/p aega vo array ki form me aega
    let as = div.getElementsByTagName("a");       // as is an array[]

    songs = [];

    // ab hum iss as[] ko traverse krke apne songs nikalenge
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // ab iss element me se links nikalenge and agar vo link apna .mp3 se end kr rha to yaani vo ek gaana hai to push in our songs[]
        if (element.href.endsWith(".mp3")) {
            // split hume 2 part la dega in array form i.e /songs/ se pehle and /songs/ ke baad ka jisme /songs/ nahi include hoga.........to usme uske baad ka part le lenge i.e 0th index vala nahi balki 1st index vala jisme song ka name hoga vo vala.
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    // ab hum ek songUL nikalenge using querySelector and tag name i.e ul ka 0th index....jisse hamara song select ho jaega
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];   // song mil gaya

    // ab songUL ke inner html ko blank krdo taaki jab bhi nayi playlist pe click krke load kre tab vo ab new ul me bane and na ki ye usi me hi append ho
    songUL.innerHTML = "";

    for (const song of songs) {
        // har ek song pe jao of songe[] and add the song in our songUL ke inner HTML me in the form of li using `` this.......and iss song name me replace all %20 with a space.......and also jo jo replace krne hai krdo aise hi syntax ko use krke
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="music.svg" alt=""><div class="songinfo"><div>${song.replaceAll("%20", " ").replaceAll("(PagalWorld.com.pe)", "").replaceAll("_320", "")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
        </li>`;
    }

    // ab hum koshish krenge ki har ek song pe ek event daal sake i.e. ki vo click ho to gaana chal jaaye vo val

    // ab humne kya kia hai document.querySelector(".songlist").getElementsByTagName("li") isse saare li aa jaenge apne paas and usko array.from krke ek array me convert kr lia and then uspe forEach loop ka use kia and har ek element 'e' pe gaye and uska songinfo vala div lia and uska first child lia jo ek element i.e ye apne paas aya pehla div i.e Song Name vala and then iska inner HTML lia jo ki hoga apna gaane ka name...............

    // and iss gaane ke name pe .trim() bhi lagaenge taaki gaane ke aage and peeche koi space na rhe jaaye and we can play our song easily isliye

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML.trim());
        })
    })

    return songs;
}

// ab bana rhe hai gaana play krne ka fn
const playMusic = (track, pause = false) => {
    // currsong ke hi src ko baar baar update krenge taaki jispe click ho vo chal jaaye and jo chal rha ho vo pause ho jaaye and play that currsong..........isme humne "/songs/" + track ye kia hai as apne saare songs "/songs/" folder me hai isliye.
    currsong.src = `/${currfolder}/` + track;

    // agar gaana pause nahi hai tohi gaana play kro
    if (!pause) {        // !pause yaani pause agar true ho jaye to play krdo jo apni next choice hogi
        currsong.play();
    }

    // ab jab gaana play ho raha hoga to iss play button ke svg ko pause krdo as play ho rha hai to next we can do is pause
    play.src = "pause.svg";

    // also jaise hi gaana play ho to uss gaane ka name aa jaye and uski duration aa jaye BUT
    // Admirin%20You%20-%20Karan%20Aujla.mp3 aise aa rha hai naam to ab ye kro ki decodeURI ka use kro
    document.querySelector(".musicinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// time conversion ka function
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Use padStart to ensure two digits for minutes and seconds
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// saare albums laane ka function
async function displayAlbums() {
    // pehle hum apne folders i.e albums fetch krenge using fetch api, and convert it to text form
    let a = await fetch(`/songs/`);
    let response = await a.text();        // songs mil gye in the form of tables

    // ab hum saare links ko nikalenge and apne ek songs[] array me push kr denge

    // ab ek div create krenge and uska inner html replace krenge by response.....i.e tables se
    let div = document.createElement("div");
    div.innerHTML = response;


    // ab ye jo bhi hum kaam kr rhe hai isko hum kr rhe hai by apne browser me spotify clone ko inspect kr krke ki kya print ho rha hai hamari console.log se i.e baar baar isme code kro and apne browser me inspect krke dekho ki vo console.log kya print kr rha hai..............................AISE HI SAMAJH AEGA KAAM KRNA...........BHOT IMPORTANT HAI YE VALA STUFF...........JAB TAIYAARI KRO TAB AISE HI KRO KI PRINT KR KRKE CHECK KRO KI KYA O/P AA RHA HAI USSE AND SEE AND THEN DECIDE 

    // get "a" vale i.e jis jisme hamare folders hai and then unn folders ko traverse using foreach loop
    let anchors = div.getElementsByTagName("a");

    let cardContainer = document.querySelector(".cardContainer");

    let array = Array.from(anchors);

    // dynamic folders using normal FOR loop
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs")) {
            // console.log(e.href.split("/").slice(4)[0]);
            let folder = e.href.split("/").slice(4)[0];

            // get the metadata of the folder now........IMPORTANT STUFF
            // can be done by using fetch API by fetching the folders and now not converting them to text, rather converting them to json
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();        // folders mil gye in the form of json

            // console.log(response);  // {title: 'Bollywood songs', description: 'My songs'} to ab isse hum response.title and response.description ko access kr skte hai jo ki krenge bhi hum and populate our folder jab bhi koi naya folder banega songs ka

            // population the card jisme h3 change to response.title and img change to cover.jpg and p change to response.description.
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder ="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5"
                        stroke-linejoin="round" />
                    <g transform="translate(6, 6)">
                        <polygon points="0 0 14 9 0 18 0 0" fill="#141B34" stroke="none"></polygon>
                    </g>
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
        </div>`
        }
    }

    // load the playlist whenever card is clicked
    // har ek card ko nikalo in the form of array and uspe i.e har ek card pe ek event listener lagado by traversing all the cards using foreach loop
    // foreach loop array me chalta hai but document.getElementsByClassName("card") hume collection lake dega to isko pehle array me convert krdo......then uspe click ka event listener lagao........click hote hi ye songs await fetch ho jaye

    // currentTarget isme isliye lagaya hai but not target taaki card pe agar event listener lagaya hai to bas vo card pe kahi bhi click kro fir bhi playlist load ho jaye chahe kahi pe bhi click ho isliye ye lagao currentTarget
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

            // ab jaise hi card pe click ho to uska pehla song chal jaaye......uss playlist ka
            playMusic(songs[0]);

            // and then set volume to 0.1 and volume slider to 10
            currsong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        })
    })
}

// getSongs hume promise return krega to isse bachne ke lie ek main fn banao ho ki async hoga and then usme songs ko lao using getSongs but await lagake
async function main() {
    // get the list of all songs.......from our 1st folder i.e karan aujla vala
    await getSongs("songs/myfav");

    // jaise hi hum songs ki list retrive kr lenge uske baad
    // ab hum kahenge ki play kro music(0th song) ko and isko true krdo pause ko jo by default false hai
    playMusic(songs[0], true);

    // get all the +nt albums
    displayAlbums();

    // ab add play, previous, next button pe click hone pe kya hoga
    play.addEventListener("click", () => {      // iska matlab hai ki play pe click krne pe ek arrow function chala do...jo ye kaam krega jo iss fn me mention kia hai humne
        if (currsong.paused) {
            // pause hai to play krdo and change svg to pause....as ab pause krna pdega aage
            currsong.play();
            play.src = "pause.svg"
        } else {
            // play hai to pause krdo and change svg to play.....as ab play krna pdega aage
            currsong.pause();
            play.src = "play.svg";
        }
    })

    // ab time update krna hai jab bhi gaane chale to yaani currsong pe ek event listner lagana hai, timeupdate ka jo ki pehle se hi library me present hai......and update this time in our songtime vala class
    currsong.addEventListener("timeupdate", () => {
        // console.log(currsong.currentTime, currsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currsong.currentTime)} / ${secondsToMinutesSeconds(currsong.duration)}`;

        // ab apna ye logic likho ki seekbar bhi chalta rahe
        // jitna duration ho gaya hai current gaane ka i.e currtime uska and jo bhi total duration thi gaane ki i.e duration se uski percent nikal lo.....uss percent se aage badhega uss circle ka left
        document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%";            // in %age
    })

    // add an event listener to seekbar i.e when we need to move seekbar by the help of mouse....to do this.
    // but make sure that we have to keep in mind that we have to see that how much is our offsetX(i.e seekbar me 'x') wrt our total width of the seekbar in %.
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;      // this show how much % song plays forward
        document.querySelector(".circle").style.left = percent + "%";           // move the circle in seekbar

        currsong.currentTime = ((currsong.duration) * percent) / 100;           // time move front with that % jitna humne click kia hai utna on the seekbar.
    })

    // add an event listener to hamburger class ki jab uspe click kre tab vo bahar nikal ke aye left me se hamari playlist....i.e set left class ka left style to 0.
    document.querySelector(".playlist").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add an event listener for cross button ki uspe click kre to vo left me vapas chala jaye i.e left set ro -100% again....but we will do -120% taaki poora ander chala jaaye
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // add an event listener to previous and next button
    previous.addEventListener("click", () => {
        // curr song ka index nikalo pehle jo bhi currsong chal rha hai.......then play kro uske previous index vala i.e index-1 vala

        // console.log(currsong.src);    // /songs/Admirin%20You%20-%20Karan%20Aujla.mp3
        // console.log(currsong.src.split("/"));    // ['http:', '', '127.0.0.1:3000', 'songs', 'Admirin%20You%20-%20Karan%20Aujla.mp3']
        // console.log(currsong.src.split("/").slice(-1));  // ['Admirin%20You%20-%20Karan%20Aujla.mp3']
        // console.log(currsong.src.split("/").slice(-1) [0]);  // Admirin%20You%20-%20Karan%20Aujla.mp3

        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);

        // mod by songe.length isliye kia hai taaki hum extreme last me aa gaye to 1st se start ho jaye and extreme 1st me aa gaye to last se start ho jaaye isliye
        playMusic(songs[(index - 1) % songs.length]);

    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0]);

        // mod by songe.length isliye kia hai taaki hum extreme last me aa gaye to 1st se start ho jaye and extreme 1st me aa gaye to last se start ho jaaye isliye
        playMusic(songs[(index + 1) % songs.length]);
    })

    // add an event listener to volume........iss baar click nahi rather use CHANGE event listener
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value);        // e.target.value (jo ki ek string ki form me hota hai) is the value range of input range type i.e 0 to 100

        // now set the current song ki volume.......target value is in form of string so set it in form of integer 1st and then divide by 100 as volume hamesha range me hoti hai 0 to 1 in JS.
        currsong.volume = parseInt(e.target.value) / 100;
    })

    // add event listener to mute the song when clicked on volume svg i.e volume me jo immediate img hai uspe click me
    document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.target);            // <img width="25" class="invert" src="volume.svg" alt=""></img>
        // console.log(e.target.src);        // /volume.svg

        // agar volume hai to mute krdo and set the volume to 0 and also set the slider's value to 0
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        // agar mute hai to volume krdo and set the volume to 0.5 and also set the slider's value to 50
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currsong.volume = 0.5;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 50;
        }
    })

}

main();