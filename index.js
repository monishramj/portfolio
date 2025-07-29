function changePage(page) {
    var content = document.getElementById('content');

    content.classList.remove('fade-in');

    content.innerHTML = '';

    let wrapper = document.createElement('div');
    wrapper.classList.add('fade-in');


    switch (page) {
        case 'home':
            wrapper.innerHTML = `
                <div class="intro">
                    <p>
                        <b>hi! i'm monish.</b>
                        i build things at the intersection of engineering and human-computer interaction.

                    </p>
                </div>

                <hr>

                <div class="box-element">
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
                </div>
                
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

                <section class="intro">
                    <br>
                    <h3>my toolbox.</h3>
                    <p>
                        <b>here's what i've worked with.</b>
                        my strongest suites are Java and Python. all technologies listed are not in any specific order.
                    </p>
                    <p>
                    <b>work in progress.</b>
                    </p>
                </section>
                `;
            break;
        case 'projects':
            wrapper.innerHTML = `
                <div class="intro">
                    <p>
                        this page is a work in progress.
                    </p>
                </div>
            `
            break;

        default:
            wrapper.innerHTML = '<h2 class="intro">page not found.</h2>';
    }

    content.appendChild(wrapper);

}