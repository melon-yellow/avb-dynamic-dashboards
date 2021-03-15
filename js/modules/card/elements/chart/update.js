//BAR CHART ELEMENT FUNCTION

export async function update(thiscd, thisElement) {

    let cd = {
        get cd() { return window.page.cards[thiscd] },
        get el() { return this.cd.layout.elements[thisElement] }
    };

        cd.el.chart.data.labels = labels;
        cd.el.chart.data.datasets = datasets;

        if (cd.el.update != null) {

            if (cd.el.update.type == "individual") {

                let duration = 1000;
                //get duration of animation
                if (cd.el.update.duration != null) {
                    duration = cd.el.update.duration;
                };
                let frames = Math.floor(duration / 20);
                cd.el.addons.animation.frame = 0;

                //set start and end
                let countchange = cd.el.addons.animation.change.length;
                for (let i = 0; i < countchange; i++) {
                    let da = cd.el.addons.animation.change[i].data[0];
                    let dt = cd.el.addons.animation.change[i].data[1];
                    let initial = cd.el.addons.animation.change[i].data[2];
                    let final = cd.el.addons.animation.change[i].data[3];
                    cd.el.addons.animation.change[i].position = [];
                    if (initial == null) {
                        cd.el.addons.animation.change[i].position[0] = 0;
                        cd.el.addons.animation.change[i].position[1] = 0;
                        cd.el.addons.animation.change[i].position[2] = Number(final);
                    } else {
                        cd.el.addons.animation.change[i].position[0] = Number(initial);
                        cd.el.addons.animation.change[i].position[1] = Number(initial);
                        cd.el.addons.animation.change[i].position[2] = Number(final);
                    };
                    //do calc
                    cd.el.addons.animation.change[i].calc = {};
                    let ini = cd.el.addons.animation.change[i].position[0];
                    let p = cd.el.addons.animation.change[i].position[1];
                    let end = cd.el.addons.animation.change[i].position[2];
                    let prop = end - ini;
                    let integral = ((Math.PI) / 4);
                    let unit = ((prop / integral) / frames);
                    //assign value to variables
                    cd.el.addons.animation.change[i].calc.prop = prop;
                    cd.el.addons.animation.change[i].calc.unit = unit;

                };

                //assign interval to animation
                let interval;
                if (duration > 0) {
                    interval = setInterval(animate, 20);
                } else {
                    cd.el.chart.update({ duration: 0 });
                };

                //animate function
                function animate() {

                    if (cd.el.addons.animation == null) {
                        cd.el.addons.animation = {};
                        clearInterval(interval);
                        return 0;
                    };
                    if (cd.el.addons.animation.change == null) {
                        cd.el.addons.animation = {};
                        clearInterval(interval);
                        return 0;
                    };

                    let countchanges = cd.el.addons.animation.change.length;
                    let s = cd.el.addons.animation.frame;
                    let v = (1 / frames) * s;
                    let speed = Math.sqrt(1 - (v * v));

                    //for each index changed
                    for (let i = 0; i < countchanges; i++) {

                        let ini = cd.el.addons.animation.change[i].position[0];
                        let p = cd.el.addons.animation.change[i].position[1];
                        let end = cd.el.addons.animation.change[i].position[2];
                        let unit = cd.el.addons.animation.change[i].calc.unit;
                        let add = unit * speed;
                        let newpos = p + add;
                        if (end > ini) { if (newpos > end) { newpos = end; }; } else { if (newpos < end) { newpos = end; }; };

                        //assign new positon to data
                        cd.el.addons.animation.change[i].position[1] = newpos;
                        let da = cd.el.addons.animation.change[i].data[0];
                        let dt = cd.el.addons.animation.change[i].data[1];

                        //check if this is the last frame
                        if (s < frames) {
                            cd.el.chart.data.datasets[da].data[dt] = newpos;
                        } else {
                            cd.el.chart.data.datasets[da].data[dt] = end;
                        };

                    };

                    //update
                    cd.el.chart.update({ duration: 0 });

                    //if this is the last frame
                    if (s >= frames) {
                        cd.el.addons.animation = {};
                        clearInterval(interval);
                    } else {
                        //add next frame
                        cd.el.addons.animation.frame += 1;
                    };

                };

            };

            if (cd.el.update.type == "default") {

                let duration = 1000;
                //get duration of animation
                if (cd.el.update.duration != null) {
                    duration = cd.el.update.duration;
                };
                //update
                cd.el.chart.update({ duration: duration });

            };

        } else {
            //update
            cd.el.chart.update({ duration: 0 });
        };

    return true;
};