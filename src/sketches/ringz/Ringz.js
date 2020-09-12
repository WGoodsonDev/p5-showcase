export default function Ringz(p){
    let metaRotation = 0.0;

    let rings = [];
    const baseRadius = 100;
    let offset = 10;
    const numRings = 10;

    class Ring{

        constructor(baseRadius, offset){
            this.radius = baseRadius + offset;
            this.points = []; // length 360
            this.noiseInit = p.random(10);

            let currentNoise = this.noiseInit;
            for(let i = 0; i < 360; i++){
                const noiseVal = p.noise(currentNoise);
                this.points.push(noiseVal);

                currentNoise += 0.01;
            }
        }

        display(){

            p.push();
            p.translate(p.width/2, p.height/2);


            for(let i = 0; i < 360; i++){
                p.stroke(160, 100, 100);
                p.strokeWeight(6);

                if(this.points[i] >= 0.5){
                    const hue = p.map(this.points[i], 0.5, 1.0, 180, 360);
                    p.stroke(hue, 100, 100);
                    p.point(0, -this.radius);
                }


                p.rotate(p.radians(1));
            }
            p.pop();

        }

        noiseShift(){
            this.noiseInit += 0.01;
            let currentNoise = this.noiseInit;
            for(let i = 0; i < 360; i++){
                const noiseVal = p.noise(currentNoise);
                this.points[i] = noiseVal;

                currentNoise += 0.01;
            }
        }
    }

    p.setup = () => {
        p.createCanvas(1200, 800);
        p.colorMode(p.HSB, 360, 100, 100);
        p.background(0, 100, 0);

        for(let i = 0; i < numRings; i++){
            rings.push(new Ring(baseRadius, offset));
            offset += 14;
        }
    }

    p.draw = () => {
        p.background(0, 100, 0);
        for(let i = 0; i < rings.length; i++){
            let currentRing = rings[i];
            // if(frameCount % 1 == 0)
            currentRing.noiseShift();
            currentRing.display();
        }
        metaRotation += p.radians(1);
    }

}
