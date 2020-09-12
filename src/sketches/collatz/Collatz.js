let canvas;

export default function Collatz(p){
    // Globals
    let trees = [];


    let segmentLength;

    let scaleFactor = 1.0;

    let oddAngle;
    let evenAngle;
    let oddAngleStep;
    let evenAngleStep;

    let oddAngleStepSave = 0;
    let evenAngleStepSave = 0;

    let numSequences;

    let mouseTextVisible = false;
    let autoRotate = false;

    class CollatzTree{
        constructor(numStartingPoints) {
            this.root = new CollatzNode(1);
            this.sequencesMaster = [];
            this.segmentLength = 10;
            for (let i = 2; i < numStartingPoints; i++) {
                let sequence = [];
                let n = i;
                do {
                    sequence.push(n);
                    n = collatz(n);
                } while (n !== 1);
                sequence.push(1);
                sequence.reverse();

                this.addToTree(this.root, sequence);

                this.sequencesMaster.push(sequence);
            }

        }

        addToTree(root, sequence){
            let sentinel = true;
            let currentNode = root;
            let i = 0;

            while(sentinel){
                let value = sequence[i];
                if(value === currentNode.value ){
                    const nextVal = sequence[i + 1];
                    if(nextVal){
                        if(currentNode.hasChildWithValue(nextVal)){ // If next value is represented in a child of this node
                        } else { // If next value is NOT in children of this node
                            currentNode.addChild(nextVal); // Add it as a child of the current node
                        }
                        currentNode = currentNode.getChildWithValue(nextVal);
                    } else {
                        sentinel = false;
                    }
                    i++;
                } else {
                    // Add next value to this node's children
                    currentNode = currentNode.addChild(value);
                }
            }
        }

        display(oddAngle, evenAngle, segmentLength){
            this.displayHelper(this.root, oddAngle, evenAngle, segmentLength);
        }

        displayHelper(node, oddAngle, evenAngle, segmentLength){
            // Draw lines from this node to its children
            // Base case: if node has no children, don't draw anything and stop
            if(node.children){
                // Current node has children
                // Draw line, recurse down the tree on each child
                node.children.forEach(child => {
                    if (child.value % 2 === 0) {
                        p.rotate(evenAngle);
                    } else {
                        p.rotate(-oddAngle);
                    }

                    p.line(0, 0, 0, -segmentLength);

                    p.push();
                    p.translate(0, -segmentLength);
                    this.displayHelper(child, oddAngle, evenAngle, segmentLength);
                    p.pop();
                });
                return;
            } // else return
        }


    }

    class CollatzNode{
        constructor(val) {
            this.value = val;
            this.children = [];
        }

        addChild(val){
            let newNode = new CollatzNode(val);
            this.children.push(newNode);
            return newNode;
        }

        hasChildWithValue(val){
            for(const child of this.children){
                if(child.value === val){
                    return true;
                }
            }
            return false;
        }

        getChildWithValue(val){
            for(const child of this.children){
                if(child.value === val){
                    return child;
                }
            }
            return false;
        }

    }

    function collatz(n){
        return(n % 2 === 0) ? n/2 : (n * 3 + 1);
    }

    function displayAngle(){
        p.stroke(255);
        p.text(`evenAngle: ${p.round(p.degrees(evenAngle), 2)} degrees`, 10, 25);
        p.text(`oddAngle: ${p.round(p.degrees(oddAngle), 2)} degrees`, 10, 50);
        p.text(`evenAngleStep: ${p.round(p.degrees(evenAngleStep), 5)} deg/frame`, 10, 100);
        p.text(`oddAngleStep: ${p.round(p.degrees(oddAngleStep), 5)} deg/frame`, 10, 75);
    }

    function displayCurrentMode(mode){
        p.stroke(255);
        p.text(`${mode} Mode`, 5, p.height - 5);
    }

    function displayMouseText(){
        p.stroke(255);
        p.text(`(e${p.round(p.degrees(evenAngle), 2)}, o${p.round(p.degrees(oddAngle), 2)})`, p.mouseX + 15, p.mouseY + 25);
    }




    function angleInc(){
        oddAngle += oddAngleStep;
        if(oddAngle > p.PI / 2){
            oddAngle = p.PI / 2;
            oddAngleStep = -oddAngleStep;
        } else if(oddAngle < 0){
            oddAngle = 0;
            oddAngleStep = -oddAngleStep;
        }

        evenAngle += evenAngleStep;
        if(evenAngle > p.PI / 2){
            evenAngle = p.PI / 2;
            evenAngleStep = -evenAngleStep;
        } else if(evenAngle < 0){
            evenAngle = 0;
            evenAngleStep = -evenAngleStep;
        }
    }


// ---------------------------------------------------------------------------------------------------------------------

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth - 18, p.windowHeight);
        p.textSize(24);
        p.background(0);

        oddAngle = p.radians(8);
        evenAngle = p.radians(8);
        oddAngleStep = p.radians(0.01);
        evenAngleStep = p.radians(0.01);
        numSequences = 120;

        for(let i = 0; i < 1; i++){
            trees.push(new CollatzTree(2000));
        }

    }

    p.draw = () => {
        p.background(0);


        p.strokeWeight(2);
        p.stroke(255, 40);

        if(!autoRotate){
            oddAngle = p.map(p.mouseX, 0, p.width, p.PI/8, 3*(p.PI/16));
            evenAngle = p.map(p.mouseY, p.height, 0, 1*(p.PI/16), 3*(p.PI/16));
        }


        trees.forEach( (tree, idx) => {
            // Translate to starting point
            p.resetMatrix();
            p.translate((p.width / 8) * (idx + 1), p.height * 0.60);
            // Draw entire tree
            segmentLength = 5 * scaleFactor;
            tree.display(oddAngle, evenAngle, segmentLength);
        });
        p.resetMatrix();



        if(autoRotate){
            displayCurrentMode("Auto Rotate");
            angleInc();
            displayAngle();
        } else {
            displayCurrentMode("Mouse Controlled");
            if(mouseTextVisible){
                displayMouseText();
            }
        }

    }

// ---------------------------------------------------------------------------------------------------------------------



    p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW) {
            evenAngleStep += p.radians(0.01);
        } else if (p.keyCode === p.DOWN_ARROW) {
            evenAngleStep -= p.radians(0.01);
        } else if(p.keyCode === p.LEFT_ARROW){
            oddAngleStep -= p.radians(0.01);
        } else if(p.keyCode === p.RIGHT_ARROW){
            oddAngleStep += p.radians(0.01);
        }  else if(p.key === ' '){
            oddAngleStepSave = oddAngleStep;
            evenAngleStepSave = evenAngleStep;
            oddAngleStep = 0;
            evenAngleStep = 0;
        } else if(p.keyCode === p.ENTER){
            autoRotate = !autoRotate;
            evenAngleStep = p.radians(0.01);
            oddAngleStep = p.radians(0.01);
        }

        if(p.abs(oddAngleStep) < p.radians(0.01))
            oddAngleStep = 0;
        if(p.abs(evenAngleStep) < p.radians(0.01))
            evenAngleStep = 0;
    }

    p.mouseClicked = () => {
        mouseTextVisible = !mouseTextVisible;
    }

// Mouse wheel zoom
    p.mouseWheel = (event) =>{
        if(event.delta < 0){
            scaleFactor = p.round(scaleFactor * 1.15, 2);
        } else if(event.delta > 0){
            scaleFactor = p.round(scaleFactor * 0.85, 2);
        }
        console.log(scaleFactor);
    }

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

}
