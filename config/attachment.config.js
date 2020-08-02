const uploadedFileSizeLimit = 20; //in mb

const forbiddenFileExtentions = [
  /exe/, /bat/, /cmd/, /sfx/, /js/, /php/,
  /jsx/, /py/, /action/, /apk/, /app/, /bin/,
  /cmd/, /com/, /command/, /cpl/, /csh/,
  /gadget/, /inf/, /ins/, /inx/, /ipa/, /isu/,
  /job/, /jse/, /ksh/, /lnk/, /msc/, /msi/,
  /msp/, /mst/, /osx/, /out/, /paf/, /pif/,
  /prg/, /ps1/, /reg/, /rgs/, /run/, /sh/,
  /scr/, /sct/, /shb/, /shs/, /u3p/, /vb/,
  /vbe/, /vbs/, /vbscript/, /workflow/,
  /ws/, /wsf/, /wsh/, /autorun/, /htaccess/
];

module.exports = {
  uploadedFileSizeLimit,
  forbiddenFileExtentions
};
