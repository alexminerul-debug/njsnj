import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const CATALOG = {
  animals: [
    {
      id: "fox",
      name: "Red fox",
      note: "A curious little explorer",
      color: "#bd642f",
    },
    {
      id: "deer",
      name: "Deer",
      note: "Gentle forest wanderer",
      color: "#b89467",
    },
    {
      id: "rabbit",
      name: "Rabbit",
      note: "Small hops, big heart",
      color: "#ded6bd",
    },
    {
      id: "sheep",
      name: "Sheep",
      note: "Your fluffiest neighbor",
      color: "#dddaca",
    },
    {
      id: "turtle",
      name: "Tortoise",
      note: "Taking the scenic route",
      color: "#749466",
    },
    {
      id: "flamingo",
      name: "Flamingo",
      note: "A splash of pink",
      color: "#d79793",
    },
    {
      id: "bear",
      name: "Brown bear",
      note: "A big, friendly presence",
      color: "#99735a",
    },
    {
      id: "horse",
      name: "Wild horse",
      note: "Born to roam free",
      color: "#996247",
    },
  ],
  nature: [
    {
      id: "pine",
      name: "Pine tree",
      note: "A little forest begins",
      color: "#557d50",
    },
    {
      id: "palm",
      name: "Palm tree",
      note: "An island essential",
      color: "#6e9659",
    },
    {
      id: "oak",
      name: "Oak tree",
      note: "Shade for everyone",
      color: "#82965c",
    },
    {
      id: "flowers",
      name: "Wildflowers",
      note: "A pocket of color",
      color: "#c996a2",
    },
    {
      id: "rock",
      name: "Boulders",
      note: "A place to pause",
      color: "#9baba0",
    },
    {
      id: "mushroom",
      name: "Mushrooms",
      note: "A tiny woodland world",
      color: "#bf795d",
    },
  ],
  build: [
    {
      id: "cabin",
      name: "Forest cabin",
      note: "Somewhere to call home",
      color: "#a27b50",
    },
    {
      id: "tent",
      name: "Canvas tent",
      note: "Sleep under the stars",
      color: "#c4a570",
    },
    {
      id: "campfire",
      name: "Campfire",
      note: "Gather around the glow",
      color: "#c68b51",
    },
    {
      id: "bench",
      name: "Park bench",
      note: "Sit with the quiet",
      color: "#9b825c",
    },
    {
      id: "windmill",
      name: "Windmill",
      note: "A breeze put to good use",
      color: "#b4a78c",
    },
    {
      id: "garden",
      name: "Garden bed",
      note: "Grow something good",
      color: "#7d9a62",
    },
  ],
};

const animalIds = new Set(CATALOG.animals.map((x) => x.id));
const materials = new Map();
const mat = (color) => {
  if (!materials.has(color))
    materials.set(
      color,
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.95,
        flatShading: true,
      }),
    );
  return materials.get(color);
};
const geometries = new Map();
function geo(key, maker) {
  if (!geometries.has(key)) geometries.set(key, maker());
  return geometries.get(key);
}
function ellipsoid(parent, color, pos, scale, detail = 1) {
  const m = new THREE.Mesh(
    geo(`ico${detail}`, () => new THREE.IcosahedronGeometry(1, detail)),
    mat(color),
  );
  m.position.set(...pos);
  m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function box(parent, color, pos, scale) {
  const m = new THREE.Mesh(
    geo("box", () => new THREE.BoxGeometry(1, 1, 1)),
    mat(color),
  );
  m.position.set(...pos);
  m.scale.set(...scale);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cone(parent, color, pos, radius, height, sides = 7) {
  const key = `cone${sides}`;
  const m = new THREE.Mesh(
    geo(key, () => new THREE.ConeGeometry(1, 1, sides)),
    mat(color),
  );
  m.position.set(...pos);
  m.scale.set(radius, height, radius);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cylinder(parent, color, a, b, r1 = 0.08, r2 = r1, sides = 6) {
  const av = new THREE.Vector3(...a),
    bv = new THREE.Vector3(...b),
    d = bv.clone().sub(av);
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r2, r1, d.length(), sides),
    mat(color),
  );
  m.position.copy(av.add(bv).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
  m.castShadow = true;
  parent.add(m);
  return m;
}

export function createModel(type) {
  const g = new THREE.Group();
  g.userData.legs = [];
  if (animalIds.has(type)) {
    const styles = {
      fox: ["#ce743c", 0.72, 0.62],
      deer: ["#b9956a", 0.85, 0.94],
      rabbit: ["#e5dfcc", 0.43, 0.38],
      sheep: ["#ebe8d7", 0.8, 0.62],
      turtle: ["#6f8b52", 0.65, 0.24],
      flamingo: ["#e6a3a0", 0.5, 1.0],
      bear: ["#947052", 1.04, 0.75],
      horse: ["#a57b55", 1.04, 1.05],
    };
    const [color, length, h] = styles[type];
    if (type === "turtle") {
      ellipsoid(g, "#667d42", [0, 0.32, 0], [0.58, 0.31, 0.77], 1);
      ellipsoid(g, "#9ca665", [0, 0.28, 0.79], [0.22, 0.18, 0.32]);
      for (const x of [-1, 1])
        for (const z of [-1, 1])
          ellipsoid(
            g,
            "#909c5d",
            [x * 0.45, 0.12, z * 0.43],
            [0.23, 0.12, 0.29],
          );
      for (let i = 0; i < 5; i++)
        ellipsoid(
          g,
          "#7f954f",
          [((i % 2) - 0.5) * 0.35, 0.58, Math.floor(i / 2) * 0.27 - 0.3],
          [0.17, 0.045, 0.19],
          0,
        );
      for (const x of [-1, 1])
        ellipsoid(
          g,
          "#28372d",
          [x * 0.15, 0.35, 0.94],
          [0.037, 0.037, 0.037],
          0,
        );
    } else if (type === "flamingo") {
      ellipsoid(g, color, [0, 0.98, 0], [0.36, 0.37, 0.56]);
      cylinder(g, color, [0, 1.1, 0.33], [0, 1.83, 0.56], 0.08);
      ellipsoid(g, color, [0, 1.88, 0.6], [0.18, 0.21, 0.2]);
      const beak = cone(g, "#e1c5a4", [0, 1.85, 0.84], 0.12, 0.3, 5);
      beak.rotation.x = Math.PI / 2;
      ellipsoid(g, "#484036", [0, 1.82, 0.96], [0.065, 0.09, 0.11], 0);
      for (const x of [-1, 1]) {
        cylinder(
          g,
          "#c27c73",
          [x * 0.13, 0.08, 0.05],
          [x * 0.13, 0.85, 0],
          0.033,
        );
        box(g, "#bf7f72", [x * 0.13, 0.06, 0.15], [0.07, 0.05, 0.29]);
        ellipsoid(g, "#2e3e35", [x * 0.14, 1.92, 0.69], [0.025, 0.03, 0.03], 0);
      }
    } else {
      const body = ellipsoid(
        g,
        color,
        [0, h, 0],
        [length * 0.48, length * 0.52, length],
      );
      let headY = h + 0.38,
        headZ = length * 0.84,
        headScale = [length * 0.42, length * 0.42, length * 0.49];
      if (type === "deer" || type === "horse") {
        headY = h + 0.61;
        headZ = length * 0.78;
        cylinder(g, color, [0, h, 0.45], [0, headY, 0.75], 0.23, 0.18);
        headScale = [0.25, 0.3, 0.41];
      }
      if (type === "rabbit") {
        headY = 0.62;
        headZ = 0.36;
        headScale = [0.28, 0.3, 0.29];
      }
      if (type === "bear") {
        headY = h + 0.4;
        headZ = 0.82;
        headScale = [0.46, 0.43, 0.42];
      }
      const head = new THREE.Group();
      head.position.set(0, headY, headZ);
      g.add(head);
      g.userData.head = head;
      ellipsoid(head, color, [0, 0, 0], headScale);
      const muzzleColor =
        type === "fox"
          ? "#f2e8d2"
          : type === "sheep"
            ? "#6c6859"
            : type === "bear"
              ? "#bba083"
              : color;
      ellipsoid(
        head,
        muzzleColor,
        [0, -0.1, headScale[2] * 0.7],
        [headScale[0] * 0.67, headScale[1] * 0.56, headScale[2] * 0.71],
      );
      ellipsoid(
        head,
        "#344036",
        [0, -0.08, headScale[2] * 1.24],
        [0.07, 0.057, 0.055],
        0,
      );
      for (const side of [-1, 1]) {
        ellipsoid(
          head,
          "#2d382e",
          [side * headScale[0] * 0.75, 0.055, headScale[2] * 0.65],
          [0.035, 0.045, 0.033],
          0,
        );
        if (type === "rabbit") {
          const e = ellipsoid(
            head,
            color,
            [side * 0.12, 0.39, -0.05],
            [0.085, 0.37, 0.085],
          );
          e.rotation.z = side * -0.18;
          const ie = ellipsoid(
            head,
            "#d8b8a7",
            [side * 0.12, 0.42, 0.015],
            [0.042, 0.25, 0.028],
          );
          ie.rotation.z = side * -0.18;
        } else if (type === "bear" || type === "sheep")
          ellipsoid(
            head,
            color,
            [side * headScale[0] * 0.8, headScale[1] * 0.7, -0.04],
            [0.13, 0.14, 0.095],
            0,
          );
        else {
          const e = cone(
            head,
            color,
            [side * headScale[0] * 0.68, headScale[1] * 1.02, -0.02],
            0.13,
            type === "fox" ? 0.36 : 0.28,
            4,
          );
          e.rotation.z = side * -0.2;
          if (type === "fox")
            cone(head, "#534337", [side * 0.18, 0.28, 0.04], 0.065, 0.18, 4);
        }
      }
      const legColor =
        type === "fox" ? "#4a4537" : type === "sheep" ? "#6f6856" : color;
      for (const x of [-1, 1])
        for (const z of [-1, 1]) {
          const leg = new THREE.Group();
          leg.position.set(x * length * 0.3, h * 0.75, z * length * 0.55);
          g.add(leg);
          const legH = h * 0.83;
          box(
            leg,
            legColor,
            [0, -legH * 0.44, 0],
            [length * 0.16, legH, length * 0.18],
          );
          if (type === "horse" || type === "deer")
            box(
              leg,
              "#4c4939",
              [0, -legH * 0.94, 0.025],
              [length * 0.18, 0.12, length * 0.22],
            );
          g.userData.legs.push(leg);
        }
      if (type === "fox") {
        const tail = ellipsoid(
          g,
          color,
          [0.04, 0.63, -1.0],
          [0.24, 0.25, 0.69],
        );
        tail.rotation.x = -0.3;
        ellipsoid(g, "#eee6d1", [0.04, 0.43, -1.51], [0.2, 0.2, 0.26]);
        ellipsoid(g, "#eee6d1", [0, 0.69, 0.48], [0.29, 0.35, 0.35]);
      }
      if (type === "rabbit")
        ellipsoid(g, "#f0ecd9", [0, 0.38, -0.42], [0.17, 0.17, 0.17]);
      if (type === "sheep") {
        for (let i = 0; i < 16; i++) {
          const a = i * 2.4;
          ellipsoid(
            g,
            i % 3 ? "#eeebdc" : "#dedcca",
            [
              Math.cos(a) * 0.38,
              0.72 + Math.sin(a * 1.7) * 0.22,
              Math.sin(a) * 0.59,
            ],
            [0.28, 0.28, 0.29],
            1,
          );
        }
      }
      if (type === "deer")
        for (const side of [-1, 1]) {
          cylinder(
            head,
            "#756b4e",
            [side * 0.15, 0.21, -0.06],
            [side * 0.27, 0.87, -0.14],
            0.05,
            0.025,
          );
          cylinder(
            head,
            "#756b4e",
            [side * 0.23, 0.57, -0.11],
            [side * 0.53, 0.77, -0.05],
            0.035,
            0.014,
          );
          cylinder(
            head,
            "#756b4e",
            [side * 0.26, 0.73, -0.13],
            [side * 0.14, 0.98, -0.2],
            0.03,
            0.01,
          );
        }
      if (type === "horse") {
        box(g, "#51483b", [0, 1.4, 0.5], [0.15, 0.52, 0.4]);
        cylinder(g, "#51483b", [0, 1.1, -0.81], [0, 0.5, -1.18], 0.12, 0.065);
      }
    }
    g.scale.setScalar(type === "rabbit" ? 1.15 : type === "flamingo" ? 0.9 : 1);
  } else if (type === "pine") {
    cylinder(g, "#8c7653", [0, 0, 0], [0, 2.5, 0], 0.13, 0.085);
    cone(g, "#386c4c", [0, 1.5, 0], 1.05, 1.75, 7);
    cone(g, "#508158", [0, 2.2, 0], 0.85, 1.65, 7);
    cone(g, "#67905d", [0, 2.9, 0], 0.59, 1.5, 7);
  } else if (type === "palm") {
    cylinder(g, "#9c8559", [0, 0, 0], [0.12, 1.5, 0], 0.16, 0.12);
    cylinder(g, "#a99162", [0.12, 1.5, 0], [0.42, 3.1, 0], 0.12, 0.09);
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7;
      const leaf = ellipsoid(
        g,
        i % 2 ? "#759853" : "#86a45d",
        [0.42 + Math.sin(a) * 0.75, 3.05, Math.cos(a) * 0.75],
        [0.26, 0.12, 1.13],
        0,
      );
      leaf.rotation.y = a;
      leaf.rotation.x = 0.22;
    }
    ellipsoid(g, "#80764d", [0.38, 2.88, 0.13], [0.2, 0.19, 0.19], 0);
    ellipsoid(g, "#80764d", [0.58, 2.87, -0.12], [0.17, 0.18, 0.17], 0);
  } else if (type === "oak") {
    cylinder(g, "#8c7655", [0, 0, 0], [0, 2.0, 0], 0.18, 0.12);
    ellipsoid(g, "#799951", [0, 2.5, 0], [1.25, 1.23, 1.1], 1);
    ellipsoid(g, "#88a75b", [0.65, 2.28, 0.3], [0.8, 0.9, 0.85], 1);
    ellipsoid(g, "#91a65e", [-0.6, 2.4, 0.2], [0.78, 0.8, 0.84], 1);
  } else if (type === "flowers") {
    for (let i = 0; i < 9; i++) {
      const x = Math.sin(i * 2.4) * 0.55,
        z = Math.cos(i * 2.4) * 0.5,
        h = 0.22 + (i % 3) * 0.12;
      cylinder(g, "#63804a", [x, 0, z], [x, h, z], 0.025);
      for (let j = 0; j < 5; j++) {
        const a = (j * Math.PI * 2) / 5;
        ellipsoid(
          g,
          i % 2 ? "#eee3a1" : "#d59eae",
          [x + Math.cos(a) * 0.09, h, z + Math.sin(a) * 0.09],
          [0.08, 0.045, 0.08],
          0,
        );
      }
      ellipsoid(g, "#d5ac54", [x, h + 0.025, z], [0.045, 0.035, 0.045], 0);
    }
  } else if (type === "rock") {
    ellipsoid(g, "#8e9c87", [0, 0.45, 0], [0.85, 0.6, 0.75], 0);
    ellipsoid(g, "#a3ac96", [0.6, 0.24, 0.3], [0.5, 0.3, 0.49], 0);
    ellipsoid(g, "#bcc0a7", [-0.6, 0.15, 0.29], [0.32, 0.23, 0.37], 0);
  } else if (type === "mushroom") {
    for (let i = 0; i < 4; i++) {
      const x = Math.sin(i * 2.1) * 0.43,
        z = Math.cos(i * 2.1) * 0.36,
        h = 0.24 + i * 0.07;
      cylinder(g, "#e4d5ad", [x, 0, z], [x, h, z], 0.07);
      ellipsoid(g, "#c38361", [x, h, z], [0.22, 0.12, 0.22], 1);
      ellipsoid(g, "#eddcbd", [x + 0.07, h + 0.1, z], [0.04, 0.02, 0.04], 0);
    }
  } else if (type === "cabin") {
    box(g, "#bca273", [0, 0.8, 0], [2.8, 1.6, 2.25]);
    box(g, "#a68c63", [0, 0.12, 0.2], [3.3, 0.24, 3.0]);
    for (let i = 0; i < 7; i++)
      box(g, "#a58a5f", [0, 0.22 + i * 0.2, 1.14], [2.8, 0.035, 0.04]);
    const roofGeo = new THREE.BufferGeometry();
    const v = [
      -1.7, 1.53, -1.4, 1.7, 1.53, -1.4, 0, 2.6, -1.4, -1.7, 1.53, 1.4, 0, 2.6,
      1.4, 1.7, 1.53, 1.4, -1.7, 1.53, -1.4, 0, 2.6, -1.4, 0, 2.6, 1.4, -1.7,
      1.53, -1.4, 0, 2.6, 1.4, -1.7, 1.53, 1.4, 1.7, 1.53, -1.4, 1.7, 1.53, 1.4,
      0, 2.6, 1.4, 1.7, 1.53, -1.4, 0, 2.6, 1.4, 0, 2.6, -1.4,
    ];
    // The roof faces outwards so it remains solid from every orbit angle.
    for (let i = 0; i < v.length; i += 9) {
      for (let axis = 0; axis < 3; axis++) {
        [v[i + 3 + axis], v[i + 6 + axis]] = [v[i + 6 + axis], v[i + 3 + axis]];
      }
    }
    roofGeo.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    roofGeo.computeVertexNormals();
    const roof = new THREE.Mesh(roofGeo, mat("#657b66"));
    roof.castShadow = true;
    g.add(roof);
    box(g, "#657b66", [0, 2.02, 1.41], [1.15, 0.9, 0.05]);
    box(g, "#715d40", [0.5, 0.65, 1.15], [0.55, 1.15, 0.06]);
    box(g, "#d6d69c", [-0.65, 0.96, 1.16], [0.6, 0.57, 0.07]);
    box(g, "#f0d2a0", [-0.65, 0.96, 1.21], [0.45, 0.41, 0.015]);
    box(g, "#806d4c", [-0.65, 0.96, 1.23], [0.04, 0.5, 0.02]);
    box(g, "#806d4c", [-0.65, 0.96, 1.23], [0.54, 0.04, 0.02]);
    box(g, "#a3a28a", [0.8, 2.3, -0.4], [0.35, 0.9, 0.4]);
  } else if (type === "tent") {
    const tent = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 1.7, 4),
      mat("#d5bd87"),
    );
    tent.rotation.y = Math.PI / 4;
    tent.position.y = 0.85;
    tent.scale.z = 1.5;
    tent.castShadow = true;
    g.add(tent);
    const door = cone(g, "#675e49", [0, 0.48, 1.43], 0.52, 1.1, 3);
    door.rotation.y = Math.PI;
    door.scale.z = 0.02;
    cylinder(g, "#886e4c", [0, 0, -1.8], [0, 1.9, -1.1], 0.04);
    cylinder(g, "#886e4c", [0, 0, 1.8], [0, 1.9, 1.1], 0.04);
  } else if (type === "campfire") {
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ellipsoid(
        g,
        "#9f9e85",
        [Math.cos(a) * 0.58, 0.13, Math.sin(a) * 0.58],
        [0.2, 0.16, 0.2],
        0,
      );
    }
    for (let i = 0; i < 3; i++) {
      const b = box(g, "#8e6e4b", [0, 0.18 + i * 0.06, 0], [0.18, 0.16, 1.0]);
      b.rotation.y = (i * Math.PI) / 3;
    }
    cone(g, "#e9a34a", [0, 0.55, 0], 0.3, 0.8, 5);
    cone(g, "#efcf75", [0.05, 0.5, 0.05], 0.19, 0.65, 5);
  } else if (type === "bench") {
    for (const x of [-0.62, 0.62])
      for (const z of [-0.23, 0.23])
        box(g, "#5d6c50", [x, 0.28, z], [0.1, 0.56, 0.1]);
    for (const z of [-0.24, 0, 0.24])
      box(g, "#b69c70", [0, 0.6, z], [1.7, 0.1, 0.2]);
    for (const x of [-0.62, 0.62])
      box(g, "#5d6c50", [x, 0.94, -0.28], [0.08, 0.8, 0.08]);
    for (const y of [0.92, 1.18])
      box(g, "#b69c70", [0, y, -0.28], [1.7, 0.19, 0.09]);
  } else if (type === "windmill") {
    const tower = cone(g, "#e1d3ae", [0, 1.3, 0], 0.84, 2.6, 6);
    tower.rotation.y = 0.52;
    cone(g, "#7c8b70", [0, 2.75, 0], 0.76, 0.7, 6);
    box(g, "#817558", [0, 0.43, 0.7], [0.4, 0.84, 0.08]);
    const blades = new THREE.Group();
    blades.position.set(0, 2.1, 0.63);
    g.add(blades);
    g.userData.blades = blades;
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Group();
      b.rotation.z = (i * Math.PI) / 2;
      blades.add(b);
      box(b, "#b4a37d", [0, 0.65, 0], [0.12, 1.5, 0.1]);
      box(b, "#e3d8ba", [0.15, 0.93, 0.02], [0.38, 0.89, 0.07]);
    }
    ellipsoid(blades, "#897b57", [0, 0, 0.08], [0.16, 0.16, 0.16]);
  } else if (type === "garden") {
    box(g, "#a48b60", [0, 0.12, 0], [1.9, 0.24, 1.4]);
    box(g, "#766b47", [0, 0.25, 0], [1.7, 0.06, 1.2]);
    for (let i = 0; i < 9; i++) {
      const x = ((i % 3) - 0.999) * 0.53,
        z = (Math.floor(i / 3) - 1) * 0.34;
      ellipsoid(g, "#80964e", [x, 0.4, z], [0.22, 0.17, 0.18], 0);
      ellipsoid(g, "#b5bb65", [x, 0.5, z], [0.11, 0.16, 0.1], 0);
    }
  }
  return g;
}

function rand(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function islandRadius(a) {
  return (
    15.8 +
    1.2 * Math.sin(a * 3 + 0.5) +
    0.85 * Math.sin(a * 5 + 1.4) +
    0.52 * Math.sin(a * 8)
  );
}
export function landHeight(x, z) {
  const a = Math.atan2(z, x),
    r = Math.hypot(x, z),
    edge = islandRadius(a);
  if (r > edge) return -0.18;
  const t = r / edge;
  if (t > 0.91) return 0.13 + (1 - t) * 3.1;
  let y = 0.51 + 0.15 * Math.sin(x * 0.55) * Math.cos(z * 0.51);
  y += Math.max(0, 1 - Math.hypot((x + 1.3) / 7.2, (z + 5.2) / 6.5)) * 4.0;
  y += Math.max(0, 1 - Math.hypot((x - 6.8) / 4.8, (z + 5.5) / 4.7)) * 1.7;
  return y;
}

export class IslandWorld {
  constructor(container, callbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.entities = [];
    this.undoStack = [];
    this.paused = false;
    this.weather = "sunny";
    this.night = false;
    this.time = 0;
    this.speed = 1;
    this.mode = "explore";
    this.selectedType = null;
    this.placementRotation = 0;
    this.pointerDown = null;
    this.lastSaved = 0;
    this.renderRequested = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#badedc");
    this.scene.fog = new THREE.Fog("#badedc", 64, 135);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D island. Drag to orbit, scroll to zoom, or select an item and click the island to place it.",
    );
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);
    this.compact = container.clientWidth < 600;
    this.scene.fog.near = this.compact ? 110 : 64;
    this.scene.fog.far = this.compact ? 220 : 135;
    this.camera = new THREE.PerspectiveCamera(
      this.compact ? 50 : 38,
      container.clientWidth / container.clientHeight,
      0.1,
      240,
    );
    this.camera.position.set(31, 30, 38).multiplyScalar(this.compact ? 1.7 : 1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.6, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.maxPolarAngle = Math.PI * 0.46;
    this.controls.minDistance = 23;
    this.controls.maxDistance = this.compact ? 135 : 90;
    this.controls.enablePan = true;
    this.controls.minPolarAngle = 0.25;
    this.controls.addEventListener("change", () => {
      this.renderRequested = true;
    });
    this.hemi = new THREE.HemisphereLight("#f3f6dd", "#7d9a72", 2.3);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight("#fff1d0", 3.3);
    this.sun.position.set(-20, 33, 17);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    Object.assign(this.sun.shadow.camera, {
      left: -26,
      right: 26,
      top: 26,
      bottom: -26,
      near: 0.5,
      far: 95,
    });
    this.sun.shadow.bias = -0.00035;
    this.sun.shadow.normalBias = 0.055;
    this.sun.shadow.radius = 3;
    this.scene.add(this.sun);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.ripples = [];
    this.makeTerrain();
    this.makeOcean();
    this.makeClouds();
    this.makeBirds();
    this.makeRain();
    this.cursor = new THREE.Mesh(
      new THREE.RingGeometry(0.68, 0.75, 40),
      new THREE.MeshBasicMaterial({
        color: "#f4f9d3",
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    this.cursor.rotation.x = -Math.PI / 2;
    this.cursor.visible = false;
    this.scene.add(this.cursor);
    this.restore();
    this.setWeather(this.weather);
    this.bindEvents();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.renderer.setAnimationLoop(() => this.animate());
  }
  makeTerrain() {
    const segments = 112,
      rings = 33,
      vs = [],
      colors = [],
      indices = [];
    const rng = rand(829);
    const c = new THREE.Color();
    for (let j = 0; j <= rings; j++)
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2,
          t = j / rings,
          r = islandRadius(a) * t,
          x = Math.cos(a) * r,
          z = Math.sin(a) * r,
          y = landHeight(x * 0.9999, z * 0.9999);
        vs.push(x, y, z);
        if (t > 0.915) c.set("#e7d5a4");
        else if (y > 2.7) c.set("#98a57b");
        else c.set(t > 0.85 ? "#adba70" : "#98ad67");
        c.multiplyScalar(0.96 + rng() * 0.08);
        colors.push(c.r, c.g, c.b);
        if (j < rings && i < segments) {
          const n = j * (segments + 1) + i;
          indices.push(
            n,
            n + segments + 1,
            n + 1,
            n + 1,
            n + segments + 1,
            n + segments + 2,
          );
        }
      }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vs, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    this.terrain = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading: true,
        roughness: 1,
        side: THREE.DoubleSide,
      }),
    );
    this.terrain.receiveShadow = true;
    this.scene.add(this.terrain);
    const sand = new THREE.Mesh(
      new THREE.CylinderGeometry(14.8, 14.2, 0.4, 96),
      mat("#d7c795"),
    );
    sand.position.y = -0.17;
    sand.scale.z = 1.02;
    this.scene.add(sand);
    // A shallow freshwater pond and its soft, sandy lip.
    const pondEdge = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 48),
      mat("#c8bc8c"),
    );
    pondEdge.rotation.x = -Math.PI / 2;
    pondEdge.position.set(7, 0.75, 3);
    pondEdge.scale.set(1, 0.65, 1);
    this.scene.add(pondEdge);
    const pond = new THREE.Mesh(
      new THREE.CircleGeometry(2.5, 48),
      new THREE.MeshStandardMaterial({
        color: "#82c5b4",
        roughness: 0.3,
        metalness: 0.05,
      }),
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(7, 0.77, 3);
    pond.scale.set(1, 0.65, 1);
    this.scene.add(pond);
    this.pond = pond;
    // A slender walking path connects the clearing with the cabin.
    for (let i = 0; i < 23; i++) {
      const x = -6 + i * 0.36,
        z = 2.2 + Math.sin(i * 0.16) * 1.5;
      const m = new THREE.Mesh(
        new THREE.CircleGeometry(0.45, 7),
        mat(i % 2 ? "#c6bd8c" : "#cfc294"),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, landHeight(x, z) + 0.025, z);
      this.scene.add(m);
    }
    // Outlying rocks make the cove feel like part of a larger archipelago.
    const rocky = [
      [-18, 4, 1.0],
      [-17, 5, 0.6],
      [17, -10, 0.65],
      [17, -11, 1.0],
      [20, 9, 0.45],
      [-12, -17, 0.6],
    ];
    for (const [x, z, s] of rocky) {
      const m = createModel("rock");
      m.position.set(x, -0.05, z);
      m.scale.setScalar(s);
      this.scene.add(m);
    }
  }
  makeOcean() {
    this.waterUniforms = { uTime: { value: 0 }, uNight: { value: 0 } };
    const material = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms,
      vertexShader: `varying vec3 vWorld; void main(){ vec4 p=modelMatrix*vec4(position,1.); vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p; }`,
      fragmentShader: `varying vec3 vWorld;uniform float uTime;uniform float uNight;
      void main(){vec2 p=vWorld.xz;float w=sin(p.x*.75+p.y*.36+uTime*.4)*sin(p.y*.9-p.x*.19+uTime*.2);float d=length(p);vec3 col=mix(vec3(.63,.82,.79),vec3(.73,.87,.85),smoothstep(13.,37.,d));col+=w*.009;float warp=sin(p.y*.7+uTime*.15)*1.5+sin(p.x*.4+uTime*.23)*.5;float patches=smoothstep(.25,.75,sin(p.x*.27+p.y*.2)*cos(p.y*.5-p.x*.17));float line=pow(max(0.,sin(p.x*.9+p.y*.8+warp+uTime*.25)),60.)*patches*.035;col+=line;col=mix(col,vec3(.12,.25,.29)+w*.008,uNight*.85);gl_FragColor=vec4(col,1.);}`,
    });
    const ocean = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), material);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -0.09;
    this.scene.add(ocean);
    const shoreMat = new THREE.MeshBasicMaterial({
      color: "#f2f0d2",
      transparent: true,
      opacity: 0.38,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    for (let k = 0; k < 3; k++) {
      const points = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2,
          r = islandRadius(a) + 0.3 + k * 0.6;
        points.push(
          new THREE.Vector3(
            Math.cos(a) * r,
            -0.07 + k * 0.003,
            Math.sin(a) * r,
          ),
        );
      }
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: "#f1f2da",
          transparent: true,
          opacity: 0.45 - k * 0.1,
        }),
      );
      this.scene.add(line);
    }
    this.wavelets = [];
    const rng = rand(349);
    for (let i = 0; i < 65; i++) {
      const a = rng() * Math.PI * 2,
        r = 19 + rng() * 35,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5 + rng() * 1.2, 0.045),
        shoreMat,
      );
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, -0.065, z);
      this.scene.add(m);
      this.wavelets.push(m);
    }
  }
  makeClouds() {
    this.clouds = [];
    const rng = rand(667);
    for (let i = 0; i < 5; i++) {
      const g = new THREE.Group();
      for (let j = 0; j < 4; j++) {
        const m = ellipsoid(
          g,
          "#eff2e3",
          [j * 0.9, Math.sin(j) * 0.2, 0],
          [1.4, 0.5, 0.8],
        );
        m.castShadow = false;
      }
      g.position.set(
        (rng() - 0.5) * 60,
        10 + rng() * 3,
        (rng() - 0.5) * 45 - 15,
      );
      g.scale.setScalar(0.9 + rng() * 0.5);
      this.scene.add(g);
      this.clouds.push(g);
    }
  }
  makeBirds() {
    this.birds = [];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.Group();
      const a = box(g, "#f0eee0", [-0.23, 0, 0], [0.5, 0.045, 0.16]),
        b = box(g, "#f0eee0", [0.23, 0, 0], [0.5, 0.045, 0.16]);
      g.userData = { wings: [a, b], phase: i };
      this.scene.add(g);
      this.birds.push(g);
    }
  }
  makeRain() {
    const rng = rand(55),
      positions = [];
    for (let i = 0; i < 650; i++)
      positions.push((rng() - 0.5) * 45, rng() * 24, (rng() - 0.5) * 45);
    this.rain = new THREE.Points(
      new THREE.BufferGeometry().setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      ),
      new THREE.PointsMaterial({
        color: "#c4e3dc",
        size: 0.07,
        transparent: true,
        opacity: 0.65,
      }),
    );
    this.rain.visible = false;
    this.scene.add(this.rain);
  }
  defaultWorld() {
    const rng = rand(4467);
    for (let i = 0; i < 69; i++) {
      const a = rng() * Math.PI * 2,
        r = 4.5 + rng() * 9.7,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      if (
        (Math.abs(x) < 6 && z > -0.8 && z < 7) ||
        (x > 4 && x < 10 && z > 0 && z < 6)
      )
        continue;
      const type = z > 6 || x > 10 ? "palm" : rng() > 0.4 ? "pine" : "oak";
      this.add(type, x, z, {
        scale: 0.68 + rng() * 0.55,
        rotation: rng() * 6.28,
        record: false,
      });
    }
    for (let i = 0; i < 20; i++) {
      const a = rng() * 6.28,
        r = 3 + rng() * 10,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      this.add(
        i % 4 === 0 ? "rock" : i % 3 === 0 ? "mushroom" : "flowers",
        x,
        z,
        { scale: 0.6 + rng() * 0.6, rotation: rng() * 6.28, record: false },
      );
    }
    this.add("cabin", -5.6, 0.8, { rotation: 0.15, record: false });
    this.add("windmill", -9, -3, { scale: 0.85, rotation: 0.3, record: false });
    this.add("bench", -3, 4.3, { rotation: 0.7, record: false });
    this.add("campfire", -1.3, 4.5, { record: false });
    this.add("garden", -7.3, 2.7, { rotation: 0.2, record: false });
    const animals = [
      ["fox", -1, 5],
      ["fox", -4, 7],
      ["deer", 2.5, -2],
      ["deer", 5, -3.3],
      ["deer", 1.2, -0.2],
      ["rabbit", -6, 5],
      ["rabbit", -5, 5.5],
      ["sheep", 2.8, 6.5],
      ["sheep", 4.5, 7],
      ["sheep", 4.1, 5.7],
      ["turtle", 9.7, 5.9],
      ["flamingo", 7.5, 4.9],
      ["flamingo", 8.5, 1.3],
      ["bear", -6, -5],
      ["horse", -2, -4],
    ];
    for (const [type, x, z] of animals)
      this.add(type, x, z, { rotation: rng() * 6.28, record: false });
  }
  add(type, x, z, opts = {}) {
    if (this.entities.length >= 500 && !opts.restoring) {
      this.callbacks.toast?.(
        "Your island is full. Remove a few things to make room.",
      );
      return null;
    }
    const model = createModel(type),
      scale = opts.scale ?? 1;
    model.position.set(x, landHeight(x, z), z);
    model.rotation.y = opts.rotation ?? this.placementRotation;
    model.scale.multiplyScalar(scale);
    const entity = {
      id: opts.id ?? crypto.randomUUID(),
      type,
      x,
      z,
      rotation: model.rotation.y,
      scale,
      model,
      animal: animalIds.has(type),
      phase: Math.random() * 6.28,
      target: null,
      wait: Math.random() * 4,
      fed: opts.fed ?? false,
      born: this.time,
    };
    model.userData.entity = entity;
    this.scene.add(model);
    this.entities.push(entity);
    if (opts.record !== false) {
      this.undoStack.push({ action: "add", entity });
      this.ripple(x, z);
      this.changed();
    }
    return entity;
  }
  remove(entity, record = true) {
    this.scene.remove(entity.model);
    this.entities = this.entities.filter((e) => e !== entity);
    if (record) {
      this.undoStack.push({ action: "remove", entity });
      this.changed();
    }
  }
  undo() {
    const action = this.undoStack.pop();
    if (!action) {
      this.callbacks.toast?.("Nothing to undo yet. Make something!");
      return;
    }
    if (action.action === "add") this.remove(action.entity, false);
    else {
      this.entities.push(action.entity);
      this.scene.add(action.entity.model);
    }
    this.changed();
    this.callbacks.toast?.("Last change undone");
  }
  setMode(mode, type = null) {
    this.renderRequested = true;
    this.mode = mode;
    this.selectedType = type;
    this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
    this.cursor.visible = false;
    this.container.dataset.mode = mode;
    this.callbacks.mode?.(mode, type);
  }
  intersection(event) {
    // New placements and camera changes must be pickable before the next frame.
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    const r = this.renderer.domElement.getBoundingClientRect();
    this.mouse.set(
      ((event.clientX - r.left) / r.width) * 2 - 1,
      -((event.clientY - r.top) / r.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObject(this.terrain)[0];
  }
  entityAt(event) {
    this.intersection(event);
    const hits = this.raycaster.intersectObjects(
      this.entities.map((x) => x.model),
      true,
    );
    for (const hit of hits) {
      let p = hit.object;
      while (p && !p.userData.entity) p = p.parent;
      if (p?.userData.entity) return p.userData.entity;
    }
    return null;
  }
  bindEvents() {
    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", (e) => {
      this.pointerDown = { x: e.clientX, y: e.clientY, button: e.button };
    });
    el.addEventListener("pointermove", (e) => {
      if (this.mode !== "place" && this.mode !== "remove") return;
      this.renderRequested = true;
      const hit = this.intersection(e);
      this.cursor.visible = !!hit;
      if (hit) {
        this.cursor.position.copy(hit.point);
        this.cursor.position.y += 0.06;
        this.cursor.material.color.set(
          this.mode === "remove" ? "#c66f54" : "#f1f7d0",
        );
      }
    });
    el.addEventListener("pointerleave", () => {
      this.cursor.visible = false;
      this.renderRequested = true;
    });
    el.addEventListener("pointerup", (e) => {
      if (
        !this.pointerDown ||
        this.pointerDown.button !== 0 ||
        Math.hypot(
          e.clientX - this.pointerDown.x,
          e.clientY - this.pointerDown.y,
        ) > 5
      )
        return;
      const hit = this.intersection(e);
      this.pointerDown = null;
      if (this.mode === "place" && this.selectedType && hit) {
        if (Math.hypot(hit.point.x - 7, hit.point.z - 3) < 2.8) {
          this.callbacks.toast?.(
            "Leave a little room for the pond. Try the grass nearby.",
          );
          return;
        }
        const entity = this.add(this.selectedType, hit.point.x, hit.point.z);
        if (entity) this.callbacks.placed?.(entity);
      } else if (this.mode === "remove") {
        const entity = this.entityAt(e);
        if (entity) {
          this.remove(entity);
          this.callbacks.toast?.(
            `${this.item(entity.type).name} removed · Undo to bring it back`,
          );
        }
      } else {
        const entity = this.entityAt(e);
        if (entity) this.callbacks.inspect?.(entity);
        else this.callbacks.closeInspect?.();
      }
    });
  }
  item(type) {
    return Object.values(CATALOG)
      .flat()
      .find((x) => x.id === type);
  }
  ripple(x, z) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const m = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.15, 32),
      new THREE.MeshBasicMaterial({
        color: "#f2f4cf",
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, landHeight(x, z) + 0.08, z);
    this.scene.add(m);
    this.ripples.push({ m, age: 0 });
  }
  feed(entity) {
    if (!this.entities.includes(entity)) return;
    entity.fed = true;
    entity.wait = 5;
    this.ripple(entity.model.position.x, entity.model.position.z);
    this.changed();
  }
  changed() {
    this.renderRequested = true;
    this.renderer.shadowMap.needsUpdate = true;
    this.callbacks.minimap?.(this.entities, this.camera);
    this.callbacks.stats?.(this.stats());
    this.callbacks.dirty?.();
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(false), 1200);
  }
  stats() {
    return {
      animals: this.entities.filter((x) => x.animal).length,
      trees: this.entities.filter((x) =>
        ["pine", "palm", "oak"].includes(x.type),
      ).length,
      objects: this.entities.length,
    };
  }
  snapshot() {
    return {
      version: 1,
      weather: this.weather,
      night: this.night,
      entities: this.entities.map((e) => ({
        type: e.type,
        x: e.model.position.x,
        z: e.model.position.z,
        rotation: e.model.rotation.y,
        scale: e.scale,
        id: e.id,
        fed: e.fed,
      })),
    };
  }
  save(notify = true) {
    try {
      localStorage.setItem("isola-world-v1", JSON.stringify(this.snapshot()));
      this.lastSaved = Date.now();
      this.callbacks.saved?.();
      if (notify)
        this.callbacks.toast?.("Your little world is saved on this device");
      return true;
    } catch {
      this.callbacks.toast?.(
        "Saving is unavailable. Download your world from Settings to keep it.",
      );
      return false;
    }
  }
  restore() {
    let data;
    try {
      const raw = localStorage.getItem("isola-world-v1");
      if (raw) data = this.validate(JSON.parse(raw));
    } catch {
      this.callbacks.toast?.(
        "Your saved island couldn’t be read. A fresh island is ready.",
      );
    }
    if (data) {
      this.load(data);
      this.lastSaved = Date.now();
    } else this.defaultWorld();
  }
  validate(data) {
    if (
      !data ||
      data.version !== 1 ||
      !Array.isArray(data.entities) ||
      data.entities.length > 500
    )
      throw new Error("This is not a valid Isola world.");
    const ids = new Set(
      Object.values(CATALOG)
        .flat()
        .map((x) => x.id),
    );
    for (const e of data.entities) {
      if (
        !ids.has(e.type) ||
        ![e.x, e.z, e.rotation, e.scale].every(Number.isFinite) ||
        Math.hypot(e.x, e.z) > 19 ||
        e.scale < 0.25 ||
        e.scale > 2
      )
        throw new Error("The world contains an invalid object.");
    }
    return data;
  }
  load(data) {
    this.validate(data);
    for (const e of [...this.entities]) this.remove(e, false);
    for (const e of data.entities)
      this.add(e.type, e.x, e.z, { ...e, record: false, restoring: true });
    this.setWeather(
      ["sunny", "cloudy", "rainy"].includes(data.weather)
        ? data.weather
        : "sunny",
    );
    this.setNight(!!data.night);
    this.undoStack = [];
    this.callbacks.stats?.(this.stats());
  }
  reset() {
    for (const e of [...this.entities]) this.remove(e, false);
    this.defaultWorld();
    this.setNight(false);
    this.setWeather("sunny");
    this.undoStack = [];
    this.resetCamera();
    this.changed();
  }
  setWeather(weather) {
    this.renderRequested = true;
    this.weather = weather;
    this.rain.visible = weather === "rainy";
    this.clouds.forEach((c) => (c.visible = weather !== "sunny"));
    if (!this.night) {
      this.sun.intensity =
        weather === "sunny" ? 3.3 : weather === "cloudy" ? 1.8 : 1.2;
      this.hemi.intensity = weather === "rainy" ? 1.8 : 2.3;
    }
    this.callbacks.weather?.(weather, this.night);
  }
  setNight(night) {
    this.night = night;
    this.waterUniforms.uNight.value = night ? 1 : 0;
    this.scene.background.set(night ? "#233c45" : "#badedc");
    this.scene.fog.color.copy(this.scene.background);
    this.sun.color.set(night ? "#b9cfed" : "#fff1d0");
    this.sun.intensity = night ? 0.8 : 3.3;
    this.hemi.intensity = night ? 0.85 : 2.3;
    this.hemi.color.set(night ? "#96b8d1" : "#f3f6dd");
    this.setWeather(this.weather);
    this.callbacks.weather?.(this.weather, night);
  }
  zoom(delta) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.multiplyScalar(delta > 0 ? 0.86 : 1.16);
    offset.clampLength(23, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset);
  }
  resetCamera() {
    this.renderRequested = true;
    this.controls.target.set(0, 0.6, 0);
    this.camera.position.set(31, 30, 38).multiplyScalar(this.compact ? 1.7 : 1);
    this.controls.update();
  }
  resize() {
    this.renderRequested = true;
    const w = this.container.clientWidth,
      h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    const compact = w < 600;
    if (compact !== this.compact) {
      this.compact = compact;
      this.camera.fov = compact ? 50 : 38;
      this.scene.fog.near = compact ? 110 : 64;
      this.scene.fog.far = compact ? 220 : 135;
      this.controls.maxDistance = compact ? 135 : 90;
      this.resetCamera();
    }
    this.camera.updateProjectionMatrix();
  }
  animate() {
    const elapsed = this.clock.getDelta();
    const rawDt = Math.min(elapsed, 0.05),
      dt = this.paused ? 0 : rawDt * this.speed;
    this.time += dt;
    const t = this.time;
    const cameraChanged = this.controls.update();
    if (
      this.paused &&
      !cameraChanged &&
      !this.renderRequested &&
      !this.ripples.length
    )
      return;
    this.waterUniforms.uTime.value = t;
    for (const entity of this.entities) {
      const m = entity.model;
      if (m.userData.blades) m.userData.blades.rotation.z -= dt * 0.4;
      if (!entity.animal || !dt) continue;
      if (entity.wait > 0) {
        entity.wait -= dt;
        if (m.userData.head)
          m.userData.head.rotation.x = Math.sin(t * 0.7 + entity.phase) * 0.1;
        continue;
      }
      if (!entity.target) {
        const a = Math.random() * 6.28,
          r = 1.8 + Math.random() * 3.2,
          x = m.position.x + Math.sin(a) * r,
          z = m.position.z + Math.cos(a) * r;
        if (
          Math.hypot(x, z) < 12.8 &&
          Math.hypot(x - 7, z - 3) > 3 &&
          landHeight(x, z) < 2.9
        )
          entity.target = { x, z };
        else entity.wait = 1 + Math.random() * 3;
        continue;
      }
      const dx = entity.target.x - m.position.x,
        dz = entity.target.z - m.position.z,
        d = Math.hypot(dx, dz);
      if (d < 0.15) {
        entity.target = null;
        entity.wait = 2 + Math.random() * 6;
        for (const l of m.userData.legs) l.rotation.x = 0;
        continue;
      }
      const velocity =
        entity.type === "turtle"
          ? 0.16
          : entity.type === "rabbit"
            ? 0.65
            : 0.35;
      m.position.x += (dx / d) * dt * velocity;
      m.position.z += (dz / d) * dt * velocity;
      m.position.y =
        landHeight(m.position.x, m.position.z) +
        (entity.type === "rabbit" ? Math.abs(Math.sin(t * 6)) * 0.09 : 0);
      const targetAngle = Math.atan2(dx, dz);
      m.rotation.y +=
        Math.atan2(
          Math.sin(targetAngle - m.rotation.y),
          Math.cos(targetAngle - m.rotation.y),
        ) * Math.min(1, dt * 4);
      m.userData.legs.forEach(
        (l, i) =>
          (l.rotation.x =
            Math.sin(
              t * 5 + entity.phase + (i === 0 || i === 3 ? 0 : Math.PI),
            ) * 0.22),
      );
    }
    this.clouds.forEach((c, i) => {
      c.position.x += dt * (0.07 + i * 0.012);
      if (c.position.x > 40) c.position.x = -40;
    });
    this.birds.forEach((b, i) => {
      const a = t * 0.08 + i * 0.6;
      b.position.set(
        Math.cos(a) * (15 + i * 0.7),
        7 + Math.sin(t * 0.5 + i) * 0.5,
        Math.sin(a) * (11 + i * 0.5),
      );
      b.rotation.y = -a;
      b.userData.wings.forEach(
        (w, j) =>
          (w.rotation.z = Math.sin(t * 3 + i) * 0.3 * (j === 0 ? 1 : -1)),
      );
    });
    if (this.rain.visible) {
      const a = this.rain.geometry.attributes.position;
      for (let i = 0; i < a.count; i++) {
        let y = a.getY(i) - dt * 15;
        if (y < 0) y = 24;
        a.setY(i, y);
      }
      a.needsUpdate = true;
    }
    this.ripples = this.ripples.filter((r) => {
      r.age += elapsed;
      r.m.scale.setScalar(1 + r.age * 12);
      r.m.material.opacity = Math.max(0, 0.6 - r.age * 0.6);
      if (r.age > 1) {
        this.scene.remove(r.m);
        r.m.geometry.dispose();
        r.m.material.dispose();
        return false;
      }
      return true;
    });
    if (!this.paused && Math.floor(t * 2) !== this.lastShadow) {
      this.renderer.shadowMap.needsUpdate = true;
      this.lastShadow = Math.floor(t * 2);
    }
    this.renderer.render(this.scene, this.camera);
    this.renderRequested = false;
    if (Math.floor(t * 2) !== this.lastMap) {
      this.lastMap = Math.floor(t * 2);
      this.callbacks.minimap?.(this.entities, this.camera);
    }
  }
  thumbnails() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(220, 160);
    renderer.setPixelRatio(1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight("#fff8e6", "#8b9d78", 2.6));
    const sun = new THREE.DirectionalLight("#fff2d5", 3.1);
    sun.position.set(-3, 6, 5);
    scene.add(sun);
    const camera = new THREE.PerspectiveCamera(32, 220 / 160, 0.1, 40);
    const images = {};
    for (const item of Object.values(CATALOG).flat()) {
      const model = createModel(item.id);
      scene.add(model);
      const bounds = new THREE.Box3().setFromObject(model),
        center = bounds.getCenter(new THREE.Vector3()),
        size = bounds.getSize(new THREE.Vector3());
      const max = Math.max(size.x, size.y, size.z);
      camera.position.set(
        center.x + max * 1.65,
        center.y + max * 0.72,
        center.z + max * 2.0,
      );
      camera.lookAt(center.x, center.y - 0.03, center.z);
      renderer.render(scene, camera);
      images[item.id] = renderer.domElement.toDataURL("image/png");
      scene.remove(model);
    }
    renderer.dispose();
    return images;
  }
}
