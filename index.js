import exampleHtml from './example.js';

const battlescribeRoot = document.createElement('div');
battlescribeRoot.id = 'root';
const mainRoot = document.createElement('div');
mainRoot.id = 'main';

const psychTable = () => {
  const temp1 = [...document.querySelectorAll('th')]
    .filter(td => td.textContent === 'Psychic Power')
    .map(el => el.parentElement.parentElement.parentElement)
    .map(el => {
      return {
        id: name + Math.floor(Math.random() * 1000000),
        psycherName: el.parentElement.firstElementChild.innerText.split(
          ' ['
        )[0],
        cast: [...el.nextElementSibling.querySelectorAll('th')]
          .filter(th => th.innerText === 'Cast')[0]
          .parentElement.parentElement.querySelector('tr+tr')
          .querySelector('td+td').innerText,
        deny: [...el.nextElementSibling.querySelectorAll('th')]
          .filter(th => th.innerText === 'Deny')[0]
          .parentElement.parentElement.querySelector('tr+tr')
          .querySelector('td+td+td').innerText,
        powers: [...el.querySelectorAll('tbody>tr')].slice(1).map(tr => ({
          powerName: tr.querySelector('td').innerText,
          charge: tr.querySelector('td+td').innerText,
          range: tr.querySelector('td+td+td').innerText,
        })),
      };
    });

  const psycherPowers = temp1
    .flatMap(psy => {
      return psy.powers.map(power => ({
        ...psy,
        power,
        powers: null,
      }));
    })
    .sort((itemA, itemB) => {
      if (itemA.power.powerName === 'Smite' && itemA.id === itemB.id) {
        return 1;
      } else if (itemB.power.powerName === 'Smite' && itemB.id === itemA.id) {
        return -1;
      } else {
        return 0;
      }
    });

  const table = document.createElement('table');
  const idCache = new Set();

  psycherPowers.forEach(
    ({ id, cast, deny, psycherName, power: { powerName, charge, range } }) => {
      const row = document.createElement('tr');
      const cells = Array(6)
        .fill()
        .map(() => document.createElement('td'));

      cells[0].innerText = psycherName + ` (${cast}/${deny})`;
      cells[0].className = 'psycherCell';
      cells[1].className = 'powerCell';
      cells[1].innerText =
        // range === '18"' && charge === '5'
        powerName === 'Smite'
          ? powerName
          : `${powerName} (${charge}/${range === 'N/A' ? '*' : range})`;
      cells.slice(2).forEach(cell => {
        cell.className = 'testCell';
      });

      if (idCache.has(id)) {
        cells.splice(0, 1);
      } else {
        cells[0].rowSpan = psycherPowers.filter(psy2 => id === psy2.id).length;
        idCache.add(id);
      }

      cells.forEach(cell => row.appendChild(cell));
      table.appendChild(row);
    }
  );

  setTimeout(() => {
    battlescribeRoot.style.display = 'none';
  }, 10);

  return table;
};
const fileUpload = () => {
  const upload = document.createElement('input');
  upload.type = 'file';

  return {
    promise: new Promise(rez => {
      window.example = () => {
        battlescribeRoot.innerHTML = exampleHtml;
        rez();
      };
      upload.addEventListener('change', () => {
        const file = upload.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener('load', () => {
          battlescribeRoot.innerHTML = reader.result;
          setTimeout(rez, 0);
        });
      });
    }),
    upload,
  };
};
const markersColumn = () => {
  const markersRoot = document.createElement('div');
  markersRoot.style.display = 'flex';
  markersRoot.style.flexDirection = 'column';
  markersRoot.style.alignItems = 'center';
  markersRoot.style.paddingTop = '3px';

  const cpsContainer = document.createElement('div');
  cpsContainer.style.marginBottom = '8px';
  cpsContainer.className = 'cpsContainer';
  Array(9)
    .fill()
    .map(() => {
      const cpMarker = document.createElement('div');
      cpMarker.className = 'cpmarker';
      return cpMarker;
    })
    .forEach(cpMarker => cpsContainer.appendChild(cpMarker));
  const cpTxt = document.createElement('span');
  cpTxt.innerText = 'CPs';
  cpTxt.style.display = 'flex';
  cpTxt.style.justifyContent = 'center';
  cpTxt.style.marginBottom = '5px';
  markersRoot.appendChild(cpTxt);
  markersRoot.appendChild(cpsContainer);

  const vpTxt = document.createElement('span');
  vpTxt.innerText = 'VPs';

  vpTxt.style.display = 'flex';
  vpTxt.style.justifyContent = 'center';
  vpTxt.style.marginBottom = '5px';
  const vpsContainer = document.createElement('div');
  vpsContainer.style.display = 'grid';
  vpsContainer.style.gridTemplateColumns = 'min-content min-content';
  vpsContainer.style.gridRowGap = '2px';
  vpsContainer.style.gridColumnGap = '8px';
  Array(12)
    .fill()
    .map(() => {
      const vpMarker = document.createElement('span');
      vpMarker.style.border = '1px solid black';
      vpMarker.style.width = '16px';
      vpMarker.style.height = '16px';
      return vpMarker;
    })
    .forEach(vpMarker => vpsContainer.appendChild(vpMarker));
  markersRoot.appendChild(vpTxt);
  markersRoot.appendChild(vpsContainer);
  return markersRoot;
};

const { promise, upload } = fileUpload();

battlescribeRoot.appendChild(upload);
document.body.appendChild(mainRoot);
document.body.appendChild(battlescribeRoot);

promise.then(() => {
  const table = psychTable();
  const markers = markersColumn();
  mainRoot.appendChild(table);
  mainRoot.appendChild(markers);
});

// setTimeout(() => window.example(), 200);
