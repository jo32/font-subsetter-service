namespace java com.xiaomi.mif2e.fontSubsetter
namespace js fontSubsetter

enum ExceptionType {
    IO = 0
}

enum FileType {
    TTF = 0,
    WOFF = 1,
    EOT = 2
}

exception IOException {
    1: ExceptionType type,
    2: string why
}

service SubsetterService {

    void genSubset(1:string filePath, 2:string outputDir, 3:string subset, 4:list<FileType> types) throws (1:IOException ex),
    map<string, string> getFontInfo(1:string filePath)
}