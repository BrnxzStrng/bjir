const fs = require('fs');
const toMs = require('ms');

const addSewaGroup = (groupId, duration = "PERMANENT", groupList) => {
  const expiration = duration === "PERMANENT" ? "PERMANENT" : Date.now() + toMs(duration);
  const newGroup = {
    id: groupId,
    expired: expiration,
    status: true,
  };
  groupList.push(newGroup);
  fs.writeFileSync("./database/sewa.json", JSON.stringify(groupList, null, 2));
};

const getSewaPosition = (groupId, groupList) => {
  return groupList.findIndex(group => group.id === groupId);
};

const getSewaExpired = (groupId, groupList) => {
  const group = groupList.find(group => group.id === groupId);
  return group ? group.expired : null;
};

const checkSewaGroup = (groupId, groupList) => {
  return groupList.some(group => group.id === groupId);
};

const expiredCheck = (client, groupList) => {
  setInterval(() => {
    const expiredGroups = groupList.filter(group => group.expired !== "PERMANENT" && Date.now() >= group.expired);

    expiredGroups.forEach(group => {
      console.log(`Sewa expired: ${group.id}`);
      client.sendMessage(group.id, { text: "Masa sewa di grup ini telah habis, bot otomatis keluar!" })
        .then(() => client.groupLeave(group.id))
        .catch(console.error);

      // Remove expired group from the list and update the JSON file
      const index = groupList.indexOf(group);
      if (index !== -1) {
        groupList.splice(index, 1);
        fs.writeFileSync('./database/sewa.json', JSON.stringify(groupList, null, 2));
      }
    });
  }, 1000);
};

const getAllPremiumUser = (groupList) => {
  return groupList.map(group => group.id);
};

module.exports = {
  addSewaGroup,
  getSewaExpired,
  getSewaPosition,
  expiredCheck,
  checkSewaGroup,
  getAllPremiumUser,
};