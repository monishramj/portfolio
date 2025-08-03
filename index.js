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
                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png" alt="Python" />
                            </div>
                            <div class="tool-name">Python</div>
                        </div>
                        <div class="tool-desc">ML, robotics</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" />
                            </div>
                            <div class="tool-name">Java</div>
                        </div>
                        <div class="tool-desc">proficient OOP</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.iconscout.com/icon/free/png-256/free-flutter-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-3-pack-logos-icons-2944876.png" alt="Flutter" />
                            </div>
                            <div class="tool-name">Flutter</div>
                        </div>
                        <div class="tool-desc">mobile dev.</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" />
                            </div>
                            <div class="tool-name">HTML</div>
                        </div>
                        <div class="tool-desc">basic sites</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" />
                            </div>
                            <div class="tool-name">CSS</div>
                        </div>
                        <div class="tool-desc">styling</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
                            </div>
                            <div class="tool-name">JS</div>
                        </div>
                        <div class="tool-desc">basic frontend</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg" alt="Unity" />
                            </div>
                            <div class="tool-name">Unity</div>
                        </div>
                        <div class="tool-desc">VR simulations</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.worldvectorlogo.com/logos/arduino-1.svg" alt="Arduino" />
                            </div>
                            <div class="tool-name">Arduino</div>
                        </div>
                        <div class="tool-desc">IoT, sensors</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-white-icon.png" alt="Git" />
                            </div>
                            <div class="tool-name">Github</div>
                        </div>
                        <div class="tool-desc">VCS + repos</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Raspberry_Pi_Logo.svg/1200px-Raspberry_Pi_Logo.svg.png" alt="RPi" />
                            </div>
                            <div class="tool-name">RPi</div>
                        </div>
                        <div class="tool-desc"></div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" alt="VS Code" />
                            </div>
                            <div class="tool-name">VS Code</div>
                        </div>
                        <div class="tool-desc">code editor</div>
                        </div>

                        <div class="tool">
                        <div class="tool-left">
                            <div class="tool-icon">
                            <img src="https://cdn.freebiesupply.com/logos/large/2x/eclipse-11-logo-svg-vector.svg" alt="Eclipse" />
                            </div>
                            <div class="tool-name">Eclipse</div>
                        </div>
                        <div class="tool-desc">Java IDE</div>
                        </div>

                    </div>
                </section>
                `;
            break;
        case 'projects':
            wrapper.innerHTML = `
                <div class="intro">
                    <p>
                        this page is a work in progress.

                        <section class="box-element">
                            <img class="box-img"
                                src="https://www.researchgate.net/profile/Praveena-Akki/publication/382146609/figure/fig2/AS:11431281259844311@1720673477163/Tracking-and-analyzing-hand-using-mediapipe_Q320.jpg"
                                alt="Placeholder Img" />
                            <div class="box-txt">
                                <h2>featured project</h2>
                                <h3>VR Haptic Glove</h3>
                                <p class="box-date">aug. 2024. - april. 2025</p>
                                <p>
                                    Wearable glove that simulates touch, using <b>Arduino + Unity + C#</b>. Includes real-time finger tracking via potentiometers and haptic feedback using servo motors.  
                                    The glove was integrated with a custom Unity simulation, paired with the Oculus Quest systems. 
                                    <br>
                                    This project was created for the Engineering Design and Development PLTW course at Neuqua Valley High school.
                                </p>
                            </div>
                        </section>
                    </p>
                </div>
            `
            break;

        default:
            wrapper.innerHTML = '<h2 class="intro">page not found.</h2>';
    }

    content.appendChild(wrapper);

}