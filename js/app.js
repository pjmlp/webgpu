import { loadShader } from './shaders.js';

function initApplication() {
    if (!navigator.gpu) {
        alert('Your browser does not support WebGPU or it is not enabled. More info: https://webgpu.io');
        return;
    } else {
        main();
    }
}

async function createPipeline(vertexShader, fragmentShader) {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();

    const canvas = document.getElementById('canvas')
    const context = canvas.getContext('webgpu');

    const swapChainFormat = 'bgra8unorm';

    context.configure({
        device,
        format: swapChainFormat
    });

    const vertexShaderWgslCode = vertexShader;

    const fragmentShaderWgslCode = fragmentShader;

    const pipeline = device.createRenderPipeline({
        vertex: {
            module: device.createShaderModule({
                code: vertexShaderWgslCode
            }),
            entryPoint: 'main'
        },
        fragment: {
            module: device.createShaderModule({
                code: fragmentShaderWgslCode
            }),
            entryPoint: 'main',
            targets: [{
                format: swapChainFormat,
            }]
        },
        primitive: {
            topology: 'triangle-list',
        }
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPassDescriptor = {
        colorAttachments: [{
            view: textureView,
            clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
            loadOp: "clear",
            storeOp: "store"
        }]
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
}

async function main() {
    let vertexShader = await loadShader("/shaders/vertex.wgsl");
    
    let fragmentShader = await loadShader("/shaders/fragment.wgsl");

    await createPipeline(vertexShader, fragmentShader);
}

// plug it into the current window
window.addEventListener('load', initApplication);