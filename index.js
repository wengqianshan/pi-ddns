const http = require('http');
const Core = require('@alicloud/pop-core');
const config = require('./config');

const { key, domain } = config;
const client = new Core(key);

async function addRecord(ip) {
  var params = {
    "DomainName": domain,
    "RR": "@",
    "Type": "A",
    "Value": ip
  }
  
  var requestOption = {
    method: 'POST'
  };
  const res = await client.request('AddDomainRecord', params, requestOption);
  console.log('新增记录: ', JSON.stringify(res));
  return res;
}

async function modifyRecord(id, ip) {
  var params = {
    "RecordId": id,
    "RR": "@",
    "Type": "A",
    "Value": ip
  }
  
  var requestOption = {
    method: 'POST'
  };
  const res = await client.request('UpdateDomainRecord', params, requestOption);
  console.log('修改记录: ', JSON.stringify(res));
  return res;
}

async function loadRecord() {
  const res = await client.request('DescribeDomainRecords', {
    DomainName: domain
  });
  return res;
}

function getIp() {
  return new Promise((resolve, reject) => {
    http.get('http://api.ipaddress.com/myip?format=json', (res) => {
      let data = '';
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const { ipaddress } = json;
          resolve(ipaddress);
        } catch (e) {
          reject();
        }
      });
    }).on('error', (e) => {
      console.error(e);
      reject();
    });
  })
}

(async () => {
  const ip = await getIp();
  // console.log(ip);
  const records = await loadRecord();
  const list = records.DomainRecords.Record;
  const record = list.find(item => item.RR === '@');
  if (!record) {
    return await addRecord(ip);  
  }
  const {Value, RecordId} = record;
  if (Value === ip) {
    console.log('不用修改');
    return;
  }
  await modifyRecord(RecordId, ip);
})();