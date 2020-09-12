export default function Corona(p){

    let noiseSeed = 0;
    let noiseInput = 0;
    let ampScalar;

    const metaRotation = 0.0;

    p.setup = () => {
        p.createCanvas(1600, 900);
        p.colorMode(p.HSB, 360, 100, 100);
    }

    p.draw = () => {
        p.background(0, 0, 0);


        p.fill(0, 0, 0);

        p.push();
        p.translate(p.width/2, p.height/2);

        const barScale = 150;

        p.rotate(metaRotation);
        const rotateAmount = p.radians(1);

        noiseInput = noiseSeed;
        for(let i = 0; i < 360; i++){
            // const ampScale = map(ampScalar, 0, 0.3, 1, 3);
            // const len = constrain(map(spectrum[i], 0, 0.15, 0, barScale * ampScale), 0, 350);
            const len = p.map(p.noise(noiseInput), 0, 1, 0, barScale);
            const hue = p.map(p.noise(noiseInput), 0, 1, 180, 320);
            p.stroke(hue, 100, 100);

            //push();
            //resetMatrix();
            //const xPos = map(i, 0, 360, 0, width);
            //line(xPos, height, xPos, height - spectrum[i]*height);
            //pop();


            p.line(100, 0, 100+len, 0);
            p.rotate(rotateAmount);
            noiseInput += 0.06;
        }


        p.strokeWeight(4);
        p.stroke(180, 100, 0);
        // circle(0, 0, 200);
        p.pop();

        noiseSeed += 0.01;
        // metaRotation += radians(0.1);
    }
}
