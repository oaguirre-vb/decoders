/*
 * TagoIO Decoders - (https://tago.io/)
 * -------------------
 * Generated by     :: vitorlima
 * Generated at     :: Fri Jul 14 2023 12:48:19 GMT+0000 (Coordinated Universal Time)
 * Machine          :: Vitors-Air <darwin> - Node.js v20.1.0
 * -------------------
*/

/* This is an example code for MioTiq Parser.
 ** MioTiq send several parameters to TagoIO. The job of this parse is to convert all these parameters into a TagoIO format.
 ** One of these parameters is the payload of your device. We find it too and apply the appropriate sensor parse.
 **
 ** IMPORTANT: In most case, you will only need to edit the parsePayload function.
 **
 ** Testing:
 ** You can do manual tests to this parse by using the Device Emulator. Copy and Paste the following code:
 ** [{ variable: "miotiq_payload", value: '{"customerId":"123456789012345","rcvTime":1686584299,"srcImsi":"01_Virtual_Device","srcIP":"10.10.10.10","srcPort":"28898","payload":"Ug=="}'}]
 **
 ** The ignore_vars variable in this code should be used to ignore variables
 ** from the device that you don't want.
 */ const ignore_vars = new Set([
    "customerId",
    "srcImsi",
    "rcvTime",
    "port",
    "srcip",
    "srcIP",
]);
/**
 * Transforms an object to a TagoIO data array object
 *
 * @param objectItem - object data to be parsed
 * @param group - default group for all data
 * @param prefix - internal use for object values
 * @returns {DataCreate} formatted data
 */ function toTagoFormat(objectItem, group, prefix = "", time) {
    const result = [];
    for(const key in objectItem){
        if (ignore_vars.has(key)) {
            continue;
        }
        const item = objectItem[key];
        if (typeof item === "object") {
            result.push({
                variable: (item["variable"] || `${prefix}${key}`).toLowerCase(),
                value: item["value"],
                group: item["serie"] || group,
                metadata: item["metadata"],
                location: item["location"],
                time: item["time"] || time,
                unit: item["unit"]
            });
        } else {
            result.push({
                variable: `${prefix}${key}`.toLowerCase(),
                value: item,
                time,
                group
            });
        }
    }
    return result;
}
function isHexadecimalString(payload1) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(payload1);
}
const miotiq_payload = payload.find((x)=>x.variable === "miotiq_payload");
if (miotiq_payload) {
    const group = String(Date.now());
    const miotqJSON = JSON.parse(miotiq_payload.value);
    if (miotqJSON) {
        const clone = { ...miotqJSON };
        payload = [{
            variable: "payload",
            value: Buffer.from(miotqJSON.payload, "base64").toString("hex"),
            group: miotiq_payload.group || String(Date.now()),
            time: miotqJSON.rcvTime * 1000,
            metadata: clone
        }];
    }
}


//#sourceMappingURL=data:application/json;charset=utf-8;base64,IntcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcImZpbGVcIjpcInN0ZG91dFwifSI=