var Config = require('../config');

var calcAttack = (params) => {
    console.log("params: ", params);
    if (params.scan && params.scan.length > 0) {
        var closest_objs = { distance: parseInt(Config.max_range), objs: [] };
        var furthest_objs = { distance: 0, objs: [] };
        var more_enemies = { number: 0, objs: [] };

        const protocols = params.protocols;

        var scan_array = params.scan;

        // It prioritizes assisting allies. If there are no allies, it attacks enemies
        if (protocols.indexOf("assist-allies") > -1 && scan_array.some((obj) => obj.allies && obj.allies > 0)) {
            scan_array = scan_array.filter((obj) => obj.allies && obj.allies > 0);
        }

         // It prioritizes attacking mechs. If there are no mechs, it attacks other enemies
         if (protocols.indexOf("prioritize-mech") > -1 && scan_array.some((obj) => obj.enemies && obj.enemies.type == "mech")) {
            scan_array = scan_array.filter((obj) => obj.enemies && obj.enemies.type == "mech");
        }
        
        scan_array = scan_array.filter((obj) => {
            if (obj && obj.coordinates && Number(obj.coordinates.x) == obj.coordinates.x && Number(obj.coordinates.y) == obj.coordinates.y) {
                var distance = distanceToObject(obj);

                if (distance < 100 && checkObjs(protocols, obj)) {
                    // Nearest objects
                    if (distance < closest_objs.distance) {
                        closest_objs.distance = distance;
                        closest_objs.objs = [obj];
                    } else if (distance == closest_objs.distance) {
                        closest_objs.objs.push(obj);
                    }

                    // Furthest objects
                    if (distance > furthest_objs.distance) {
                        furthest_objs.distance = distance;
                        furthest_objs.objs = [obj];
                    } else if (distance == furthest_objs.distance) {
                        furthest_objs.objs.push(obj);
                    }

                    // More enemies objects
                    if (obj && obj.enemies && obj.enemies.number > more_enemies.number) {
                        more_enemies.number = obj.enemies.number;
                        more_enemies.objs = [obj];
                    } else if (obj.enemies.number == more_enemies.number) {
                        more_enemies.objs.push(obj);
                    }

                    return true;
                }
            }
        });

        // Distance control
        if (protocols.indexOf("closest-enemies") > -1) {
            scan_array = scan_array.filter((obj) => {
                return distanceToObject(obj) == closest_objs.distance;
            })
        } else if (protocols.indexOf("furthest-enemies") > -1) {
            scan_array = scan_array.filter((obj) => {
                return distanceToObject(obj) == furthest_objs.distance;
            })
        }
        
        if(scan_array.length > 0) {
            return scan_array[0].coordinates;
        } else {
            return {};
        }
    } else {
        return {};
    }


}

var distanceToObject = (obj) => {
    var x_point = obj.coordinates.x;
    var y_point = obj.coordinates.y;

    return Math.sqrt(Math.pow(x_point - parseInt(Config.x_droide), 2) + Math.pow(y_point - parseInt(Config.y_droide), 2));
}

var checkObjs = (protocols, obj) => {
    if (protocols.indexOf("avoid-crossfire") > -1) {
        if(obj.allies && obj.allies > 0) return false;
    }

    if (protocols.indexOf("avoid-mech") > -1) {
        if(obj.enemies && obj.enemies.type == "mech") return false;
    }

    return true;
}

exports.calcAttack = calcAttack;