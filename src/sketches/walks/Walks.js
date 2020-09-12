export default function Walks(p){
    let scaleFactor = 10;

    let numWalks = 16;
    let walkMinLength = 800;
    let walkMaxLength = walkMinLength * 1.25;
    let walks = [];
    let longestWalk;

    let numStepsPerWalk = 0;

    let animationSpeed = 1.0;

    const stepMap = {
        0: 'u',
        1: 'd',
        2: 'l',
        3: 'r'
    }

    const opposites = {
        'u': 'd',
        'd': 'u',
        'l': 'r',
        'r': 'l'
    }

    const dXdY = {
        'u': {
            'dx': 0,
            'dy': -1
        },
        'd': {
            'dx': 0,
            'dy': 1
        },
        'l': {
            'dx': -1,
            'dy': 0
        },
        'r': {
            'dx': 1,
            'dy': 0
        },
    }

    class Walk{
        constructor(originX, originY, length) {
            this.origin = [originX, originY];
            this.walkLength = length;
            this.steps = generateWalk(length);
            this.segments = 0;
        }

        drawOrigin(){
            // Draw circle at origin
            p.fill(0, 0, 10);
            p.circle(this.origin[0], this.origin[1], scaleFactor / 2);
        }

        display(steps){
            p.noFill();
            p.beginShape();

            let currentPoint = this.origin;

            // For each step in this walk,
            for(let i = 0; i < p.min(steps, this.walkLength); i++){
                // Access current step
                const step = this.steps[i];
                // Look up correct dx, dy values for current step
                let dx = dXdY[step]['dx'];
                let dy = dXdY[step]['dy'];

                p.vertex(currentPoint[0], currentPoint[1]);
                // Next point: (dx * scaleFactor, dy * yScl)
                currentPoint = [currentPoint[0] + (dx * scaleFactor), currentPoint[1] + (dy * scaleFactor)];
            }

            p.endShape();

        }

    }


    function generateWalk(length){
        // Keep track of points visited by walk
        let current = [0, 0];
        let seen = [];
        seen.push([...current]);

        let walk = [];

        // Generate each step
        for(let i = 0; i < length; i++){
            // ATTEMPT A STEP
            // Get random integer in range [0, 3]
            let randResult = p.random([0, 1, 2, 3]);
            // Convert into new step character
            let newStep = stepMap[randResult];

            // Update current position
            let dx = dXdY[newStep]['dx'];
            let dy = dXdY[newStep]['dy'];

            current[0] += dx;
            current[1] += dy;

            // CHECK STEP ATTEMPT
            // Make sure this next step is not opposite to last step
            // (TODO) and isn't leading to a previously visited point
            while(newStep === opposites[walk[i-1]]){
                // Roll current position back one step
                current[0] -= dx;
                current[1] -= dy;

                // Get random integer in range [0, 3]
                randResult = p.round(p.random(3));
                // Convert into new step character
                newStep = stepMap[randResult];

                // Update current position
                dx = dXdY[newStep]['dx'];
                dy = dXdY[newStep]['dy'];
                current[0] += dx;
                current[1] += dy;

            }
            // Push new step into array to be returned
            walk.push(newStep);
            // Add current position to seen points
            seen.push([...current]);



        }

        return walk;
    }

    function newWalks(){
        walks = [];
        numStepsPerWalk = 0;
        for(let i = 0; i < numWalks; i++){
            const newWalk = new Walk(p.mouseX, p.mouseY, p.int(p.random(walkMinLength, walkMaxLength)));
            walks.push(newWalk);
        }

        // Find walkLength of longest walk for easing function
        let walkLengths = [];
        walks.forEach(walk => {
            walkLengths.push(walk.walkLength);
        });
        longestWalk = Math.max(...walkLengths);
        console.log('longest walk: ', longestWalk);
    }

    function easeInOutQuad(t){
        t *= 2;
        if (t < 1)
            return t * t / 2;
        t--;
        return -(t * (t - 2) - 1) / 2;
    }


// ---------------------------------------------------------------------------------------------------------------------

    p.setup = () => {
        p.createCanvas(p.windowWidth - 25, p.windowHeight - 25);
        p.colorMode(p.HSB, 100);
        p.background(0, 0, 10);
        // blendMode(SCREEN);
        newWalks();
    }

    p.draw = () => {
        p.background(0, 0, 5);

        // if(frameCount % 2 === 0){numStepsPerWalk += animationSpeed;}

        const easeT = p.map(numStepsPerWalk, 0, longestWalk, 0, 1);

        animationSpeed = p.map(easeInOutQuad(easeT), 0, 1, 1.0, 2.0);

        if(p.frameCount % 1 === 0){numStepsPerWalk += animationSpeed;}



        p.stroke(0, 0, 15);
        p.strokeWeight(1);

        // Draw grid lines
        // for(let i = 0; i <= width; i += scaleFactor){
        // 	line(i, 0, i, height);
        // }
        //
        // for(let i = 0; i <= height; i += yScl){
        // 	line(0, i, width, i);
        // }


        walks.forEach((walk, idx) => {
            let hue = p.map(idx, 0, walks.length, 0, 50);
            p.stroke(hue, 100, 100, 10);
            p.strokeWeight(2);
            walk.display(numStepsPerWalk);

            walk.drawOrigin();
        })

        p.textSize(24);
        p.fill(0, 0, 50);
        p.text(p.int(p.frameRate()), 10, p.height - 14);
    }

// ---------------------------------------------------------------------------------------------------------------------


    p.mouseClicked = () => {
        if(p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            newWalks();
        }
    }

// Mouse wheel zoom
    p.mouseWheel = (event) => {
        if(event.delta < 0){
            scaleFactor = scaleFactor * 1.25;
        } else if(event.delta > 0){
            scaleFactor = scaleFactor * 0.75;
        }
    }

}
