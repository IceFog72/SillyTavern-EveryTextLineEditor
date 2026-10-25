import { a as languages } from "../../core-Dr0o9A-8.js";
import { r as extend } from "../../language-CXbc22uF.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import "./c.js";
//#region src/prism/languages/hlsl.js
languages.hlsl = extend("c", {
	"class-name": [languages.c["class-name"], /\b(?:AppendStructuredBuffer|BlendState|Buffer|ByteAddressBuffer|CompileShader|ComputeShader|ConsumeStructuredBuffer|DepthStencilState|DepthStencilView|DomainShader|GeometryShader|Hullshader|InputPatch|LineStream|OutputPatch|PixelShader|PointStream|RWBuffer|RWByteAddressBuffer|RWStructuredBuffer|RWTexture(?:[123]D|[12]DArray)|RasterizerState|RenderTargetView|SamplerComparisonState|SamplerState|StructuredBuffer|Texture(?:[123]D|[12]DArray|2DMS|2DMSArray|Cube|CubeArray)|TriangleStream|VertexShader)\b/],
	"keyword": [/\b(?:asm|asm_fragment|auto|break|case|catch|[ct]buffer|centroid|char|class|column_major|compile|compile_fragment|const|const_cast|continue|default|delete|discard|do|dynamic_cast|else|enum|explicit|export|extern|for|friend|fxgroup|goto|groupshared|if|in|inline|inout|interface|line|lineadj|linear|long|matrix|mutable|namespace|new|nointerpolation|noperspective|operator|out|packoffset|pass|pixelfragment|point|precise|private|protected|public|register|reinterpret_cast|return|row_major|sampler?|shared|short|signed|sizeof|[su]norm|stateblock|stateblock_state|static|static_cast|string|struct|switch|technique|technique1[01]|template|texture|this|throw|triangle|triangleadj|try|typedef|typename|uniform|union|unsigned|using|vector|vertexfragment|virtual|void|volatile|while)\b/, /\b(?:bool|double|dword|float|half|min(?:10float|12int|16(?:float|u?int))|u?int)(?:[1-4](?:x[1-4])?)?\b/],
	"number": /(?:(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?|\b0x[a-fA-F\d]+)[fFhHlLuU]?\b/,
	"boolean": boolean
});
//#endregion

//# sourceMappingURL=hlsl.js.map