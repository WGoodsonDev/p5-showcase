

export default function Recaman(p){
    let recaman;

    class Sequence{
        constructor(){
            this.numLine = new NumberLine(p.height/2, 1000);
            this.current = 0;
            this.iteration = 0;
            this.stepSize = 0;

            this.debugText = `Current: ${this.current}
        Iteration: ${this.iteration}`;
        }

        getCurrent(){return this.current;}
        getIteration(){return this.iteration;}
        getStepSize(){return this.stepSize;}

        stepForward(){
            this.numLine.togglePoint(this.current);
            if(this.current - this.stepSize >= 0 && !this.numLine.getPoint(this.current - this.stepSize)){
                this.current -= this.stepSize;
            } else {
                this.current += this.stepSize;
            }

            this.stepSize += 1;
            this.iteration += 1;

            this.numLine.printSeen();
        }

        stepForwardByN(n){
            for(let i = 0; i < n; i++){
                this.stepForward();
            }
        }

        stepBack(){

        }

        display(){this.numLine.display();}

        hideShow(){this.numLine.hideShow();}
    }

    class NumberLine{

        constructor(y, size){
            this.yCoord = y;
            this.onScreenCount = p.width / 50;
            this.line = new Array(size).fill(false);
            this.displayAxis = false;

            this.backJump = false;

            this.seen = [];
        }

        getPoint = (point) => this.line[point];

        togglePoint = (point) => {
            this.line[point] = true;
            this.seen.push(point);
            if(point > this.onScreenCount){
                this.onScreenCount = point;
            }
        }

        display = () => {
            if(this.displayAxis){
                p.line(0, this.yCoord, p.width, this.yCoord);
            }

            //arcs
            p.noFill();
            const scale = p.width / this.onScreenCount;
            //beginShape();
            for(let i = 0; i < this.seen.length; i++){
                const first = this.seen[i-1];
                const second = this.seen[i];
                const center = (p.abs(first + second) / 2.0) * scale;
                const radius = p.abs(((first + second) / 2.0) - first) * scale * 2;

                p.push();

                if(first > second){//Going from high number to low (under line)
                    p.arc(center, p.height/2, radius, radius, 0, p.PI);
                    //beginShape();
                    //for(let j = 0; j < PI; j += PI / 60){
                    //  curveVertex(sin(j)*radius, cos(j)*radius);
                    //}
                    //endShape();
                } else if(first < second){//Going from low number to high (over line)
                    p.arc(center, p.height/2, radius, radius, p.PI, p.TWO_PI);
                    //beginShape();
                    //for(let j = PI; j < TWO_PI; j += PI / 60){
                    //  curveVertex(sin(j)*radius, cos(j)*radius);
                    //}
                    //endShape();
                }

                p.pop();
            }

            // dots on number line
            //fill(255);
            //let i = 0;
            //for(let x = 0; x < width; x += width / this.onScreenCount){
            //  if(this.line[i])
            //    circle(x, this.yCoord, 4);
            //  i++;
            //}

        }

        printSeen = () => {
            this.seen.forEach(i => console.log(i));
        }

        hideShow = () => {
            this.displayAxis = !this.displayAxis;
        }


    }



    p.setup = () => {
        p.createCanvas(800, 800);

        recaman = new Sequence();
        console.log(recaman);
    }

    p.draw = () => {
        p.background(0);
        p.fill(255);
        p.stroke(255);

        p.push();

        recaman.display();

        p.pop();

        if(p.frameCount % 6 === 0){
            recaman.stepForward();
        }
    }
}


