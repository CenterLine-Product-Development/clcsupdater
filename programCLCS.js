// js code to requiest cpedge/getInfoNew


const info_device_selected = document.getElementById("info_device_selected");

// const connectButton = document.getElementById("but_select_device");
const disconnectButton = document.getElementById("but_disconnect_device");
const programButton = document.getElementById("but_program_device");

const progressFirmware = document.getElementById("progressFirmware");



import { Transport, ESPLoader } from './bundle.js';


let device = null;
let transport;
let chip;
let esploader;



async function fetchAndReadBinaryString(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const binaryString = reader.result;
                resolve(binaryString);
            };

            reader.onerror = reject;

            reader.readAsBinaryString(blob);
        });
    } catch (error) {
        console.error("Error fetching or reading binary string:", error);
        return null;
    }
}



// let file1 = null, file2 = null, file3 = null;

programButton.onclick = async () => {
    file_firmware = file_object.files[0];
    // Console.log the url of the file in the object file_object
    if (file_firmware == null) {
        alert("Please select a file to program");
        return;
    }
    else {
        file_url = file_firmware.name;
        console.log("File URL is ", file_url);
        console.log("File Object is ", file_firmware);

        // fetch the data from the file
        // const data = await file_firmware.text();
        // console.log("Data length is:", data.length);

    }
    programming_in_progress = true;

    if (device === null || true) {
        device = await navigator.serial.requestPort();
        transport = new Transport(device);
    }

    try {
        const flashOptions = {
            transport,
            // baudrate: 460800,
            baudrate: 921600,
            // terminal: term,
        };
        esploader = new ESPLoader(flashOptions);

        chip = await esploader.main_fn();

        info_device_selected.innerText = chip;


    } catch (e) {
        console.error(e);
        info_device_selected.innerText = "Failed to Open COM Port";

    }


    var files = [

        {
            addr: 0x8000,
            path: "partitions.bin",
            name: "Partitions"
        },
        {
            addr: 0xe000,
            path: "boot_app0.bin",
            name: "Boot_App"
        },
        {
            addr: 0x1000,
            path: "bootloader.bin",
            name: "Bootloader"
        },
        {
            addr: 0x10000,
            path: "release_bins/firmwareFALSE.bin",
            name: "Firmware"
        },
    ]

    // loop through all Files
    var fileA = [];



    var program_list_span = document.getElementById("programming_list");
    var program_list = "";

    program_list += '<div class="table-responsive"><table class="table">';
    program_list += '<tr>';
    program_list += '<td class="col-3">Erasing</td>';
    program_list += '<td><strong><span id="programming_erase"></span></strong></td > ';
    program_list += '</tr>';

    files.forEach((file) => {
        program_list += '<tr>';
        program_list += '<td class="col-3"> ' + file.name + '</td>';
        program_list += '<td><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" id="' + file.name + 'progress" ></div ></div ></td > ';
        program_list += '</tr>';
    });

    program_list += '</table></div>';

    program_list_span.innerHTML = program_list;

    var program_erase = document.getElementById("programming_erase");
    program_erase.innerHTML = 'In progress <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">...</span></div>'

    programButton.classList.add("visually-hidden");


    const promises = files.map(file => {
        if (file.name !== "Firmware") {
            return fetchAndReadBinaryString(file.path)
                .then(binaryString => {
                    if (binaryString !== null) {
                        console.log(binaryString); // Here you have the binary string
                        return binaryString;
                    }
                });
        }
        else {
            console.log("Loading Firmware : " + file_firmware.name);
            // return file_firmware.text();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = event => resolve(event.target.result);
                reader.onerror = error => reject(error);
                reader.readAsBinaryString(file_firmware);
            });
        }
    }).filter(promise => promise !== undefined);

    const buffers = await Promise.all(promises)

    buffers.forEach((buffer, index) => {
        // var decoder = new TextDecoder('utf-8');
        // var string = decoder.decode(buffer);
        console.log("Buffer length is:" + buffer.length);

        fileA.push({ data: buffer, address: files[index].addr });
    });

    // append the file data in file_firmware to the fileA array
    // firmware_data = await file_firmware.text();

    // fileA.push({ data: firmware_data, address: 0x10000 });

    console.log('All files loaded:', fileA);
    // Do something with the fileA array here

    await esploader.write_flash({
        fileArray: fileA,
        // flashSize: "16MB",
        flashSize: "keep",
        // flashFreq: "40m",
        flashFreq: "keep",
        // flashMode: "dio",
        flashMode: "keep",
        eraseAll: !0,
        compress: !0,
        reportProgress: (fileIndex, written, total) => {
            // console.log(fileIndex + " : " + written + "/" + total + " : " + Math.floor(100 * (written / total)) + "%");

            program_erase.innerHTML = 'Complete';
            var percent = Math.floor(100 * (written / total));
            var progress_bar = document.getElementById(files[fileIndex].name + "progress");
            progress_bar.setAttribute('aria-valuenow', percent);

            // Update the progress bar style
            progress_bar.style.width = percent + '%';

            if (percent == 100) {
                progress_bar.classList.remove("progress-bar-animated");
                progress_bar.classList.remove("progress-bar-striped");
                progress_bar.classList.add("bg-success");
            }

        }
    });

    console.log("Programming Complete");

    var success_alert = document.getElementById("programming_success_alert");
    success_alert.classList.remove("visually-hidden");



    await transport.setDTR(0);
    await transport.setRTS(0);

    // wait 500ms
    await new Promise(r => setTimeout(r, 500));


    await transport.setDTR(1);
    await transport.setRTS(1);

    // wait 500ms
    await new Promise(r => setTimeout(r, 500));





    if (transport) await transport.disconnect();


    info_device_selected.innerText = "Disconnected";
    // program_list_span.innerHTML = "";

    programming_in_progress = false;

}



function writeProgrammingError() {
    const elem = document.getElementById("info_programming_error");
    elem.innerHTML = 'Programming Failed <i class="bi bi-exclamation-octagon-fill"></i>';
}
