const projectsData = [
    {
        title: "VR Haptic Glove",
        subtitle: "featured project",
        date: "aug. 2024 - apr. 2025",
        img: "assets/images/vrglove.jpg",
        img_alt: "photo of VR glove",
        desc: "Wearable glove that simulates touch, using <b>Arduino + Unity + C#</b>. Includes real-time finger tracking via potentiometers and haptic feedback using servo motors. The glove was integrated with a custom Unity simulation, paired with the Oculus Quest systems.",
        context: "This project was created for the Engineering Design and Development PLTW course at Neuqua Valley High school.",
        tech: ["VR", "Arduino", "Unity", "C#", "C++"],
        orientation: "left"
    },

    {
        title: "DiabFit",
        subtitle: "",
        date: "aug. 2023 --",
        img: "assets/images/diabfit.jpg",
        img_alt: "diabfit",
        desc: "Insulin-management app for diabetics that offers personalized medical insights and calculated insulin doses. The app uses <b>Edamam API serivces</b> for food nutrition info. Made with <b>Flutter</b> and currently in closed testing on Google Play Services.",
        context: "This app aims to simplify idiabetes management, especially for children, seniors, and newly diagnosed individuals. Users can input their current meal, insulin-based medical info, and it'll calculate relevant information such as their insulin sensitivity factor, total daily insulin dose, and approximate insulin doses based on diet and glucose levels. ",
        tech: ["Flutter", "Dart", "Google Play Services", "REST APIs"],
        orientation: "right"

    },

    {
        title: "Computer Vision Drone",
        subtitle: "",
        date: "may 2025 - july 2025",
        img: "assets/images/drone.jpeg",
        img_alt: "photo of drone with RPi5 and gimbal w/ camera",
        desc: "A computer vision algorithm that allows an aerial 'drone' vehicle to survey a field and identify ground Points of Interest (POIs) for the UAS4STEM Beginner Division competition. Features real-time identification and GPS coordinate mapping using <b>OpenCV</b> and <b>DroneKit/pymavlink Python</b>. Built on the Holybro X500 V2 drone with Raspberry Pi 5.",
        context: "This project aimed for a completely hands-off solution that combines autonomous flight control with image recognition and homography calculations. The drone can survey a designated field (inputted in Mission Planner software), identify POIs through image recognition, and calculate precise GPS coordinates of ground targets. Demonstrates practicality of UAS in STEM fields while maintaining safety through waypoint override capabilities.",
        tech: ["Python", "OpenCV", "DroneKit", "RPi 5",],
        orientation: "left"
    }
]

const toolsData = [
    {
        name: "Python",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
        desc: "ML, robotics",
    },
    {
        name: "Java",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        desc: "proficient OOP",
    },
    {
        name: "Flutter",
        img: "https://cdn.iconscout.com/icon/free/png-256/free-flutter-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-3-pack-logos-icons-2944876.png",
        desc: "mobile dev.",
    },
    {
        name: "HTML",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
        desc: "basic sites",
    },
    {
        name: "CSS",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
        desc: "styling",
    },
    {
        name: "JS",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        desc: "basic frontend",
    },
    {
        name: "Unity",
        img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg",
        desc: "VR simulations",
    },
    {
        name: "Arduino",
        img: "https://cdn.worldvectorlogo.com/logos/arduino-1.svg",
        desc: "IoT, sensors",
    },
    {
        name: "GitHub",
        img: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-white-icon.png",
        desc: "VCS + repos",
    },
    {
        name: "RPi",
        img: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Raspberry_Pi_Logo.svg/1200px-Raspberry_Pi_Logo.svg.png",
        desc: "IoT, automation",
    },
    {
        name: "VS Code",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png",
        desc: "code editor",
    },
    {
        name: "Eclipse",
        img: "https://cdn.freebiesupply.com/logos/large/2x/eclipse-11-logo-svg-vector.svg",
        desc: "Java IDE",
    },
];


function createProject(project) {
    const techStack = project.tech.map(tech =>
        `<span class="tech-badge">${tech}</span>`
    ).join('');

    if (project.orientation === "right") {
        return `
            <section class="box-element">
                <div class="box-txt">
                    <h2>${project.subtitle}</h2>
                    <h3>${project.title}</h3>
                    <p class="box-date">${project.date}</p>
                    <p>
                        ${project.desc}
                        <br>
                        ${project.context}
                    </p>
                    <div>
                        ${techStack}
                    </div>
                </div>
                <img class="box-img"
                    src="${project.img}"
                    alt="${project.img_alt}" />
            </section>
        `
    } else {
        return `
            <section class="box-element">
                <img class="box-img"
                    src="${project.img}"
                    alt="${project.img_alt}" />
                <div class="box-txt">
                    <h2>${project.subtitle}</h2>
                    <h3>${project.title}</h3>
                    <p class="box-date">${project.date}</p>
                    <p>
                        ${project.desc}
                        <br>
                        ${project.context}
                    </p>
                    <div>
                        ${techStack}
                    </div>
                </div>
            </section>
        `
    }

}

function createTool(project) {
    return `
        <div class="tool">
            <div class="tool-left">
                <div class="tool-icon">
                <img src="${project.img}" alt="${project.name}" />
                </div>
                <div class="tool-name">${project.name}</div>
            </div>
            <div class="tool-desc">${project.desc}</div>
        </div>
    `
}

const toolsHTML = toolsData.map(createTool).join('');


function changePage(page) {
    var content = document.getElementById('content');

    content.classList.remove('fade-in');

    content.innerHTML = '';

    let wrapper = document.createElement('div');
    wrapper.classList.add('fade-in');


    switch (page) {
        case 'home':
            wrapper.innerHTML = `
                <section class="intro">
                    <p>
                        <b>hi! i'm monish.</b>
                        i build things at the intersection of engineering and human-computer interaction.

                    </p>
                </section>

                <hr>

                <section class="box-element">
                    <img class="box-img"
                        src="https://www.researchgate.net/profile/Praveena-Akki/publication/382146609/figure/fig2/AS:11431281259844311@1720673477163/Tracking-and-analyzing-hand-using-mediapipe_Q320.jpg"
                        alt="Placeholder Img" />
                    <div class="box-txt">
                        <h2>☂ currently building</h2>
                        <h3>ASL Interpreter</h3>
                        <p>
                            ML project to detect ASL (American Sign Language) alphabet and symbols and translate to text,
                                using <b>MediaPipe + Python + TensorFlow.</b>
                            Currently in the learning phase and planning the basic idea for the project.
                        </p>
                    </div>
                </section>
        `;
            break;
        case 'about':
            wrapper.innerHTML = `
                <section class="intro">
                    <h3>my story.</h3>
                    <p><b>hi! i'm monish.</b></p>
                    <p>i'll be pursuing <b>Computer Science @ Purdue University</b> this fall. 
                        my foundation lies in engineering: i've lead as President and Lead Payload Engineer for my Aerial
                        Robotics team. beyond robotics, i've worked with human-computer interaction, virtual reality systems and machine
                        learning through <b> mobile development, simulation/game development, and embedded systems programming.</b> 
                        i aim to make digital yet human-centric solutions to real technical problems. i'm especially drawn to interdisciplinary challenges, 
                        threading design, software, and hardware.
                    </p>
                    <p>
                        <b>i love to learn and get immersed in whatever creative realm i find.</b> in my spare time, you can
                        find me watching movies and attempting to be a film connoisseur, drawing characters in my sketchbook, and being
                        with my family. i also have an origami collection of miscellaneous sorts: Star Wars, animals, random
                        cool shapes.
                    </p>
                    <p>
                        i'm always open to meeting new people and communicating. <em>feel free to reach out!</em>
                    </p>
                </section>

               <section class="toolbox">
                    <h3>my toolbox.</h3>
                    <div class="tools-showcase">
                        ${toolsHTML}
                    </div>
                </section>
                `;
            break;
        case 'projects':
            const projectsHTML = projectsData.map(createProject).join('');

            wrapper.innerHTML = `
                <div class="intro">
                    <p>
                        a collection of things i've built and am currently working on. this page is a work in progress.
                    </p>
                    <hr>

                ${projectsHTML}
                </div>

                
            `
            break;

        default:
            wrapper.innerHTML = '<h2 class="intro">page not found.</h2>';
    }

    content.appendChild(wrapper);

}


