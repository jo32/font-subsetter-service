package com.xiaomi.mif2e.fontSubsetter;

import java.io.File;
import java.util.List;

import org.apache.thrift.TException;

import com.google.typography.font.sfntly.Font;
import com.google.typography.font.tools.fontinfo.DataDisplayTable;
import com.google.typography.font.tools.fontinfo.FontInfo;
import com.google.typography.font.tools.fontinfo.FontUtils;
import com.xiaomi.mif2e.fontSubsetter.SubsetterService.Iface;

public class SubsetterServiceHandler implements Iface {

	@Override
	public void genSubset(String filePath, String outputDir, String subset,
			List<FileType> types) throws IOException, TException {

		File fontFile = new File(filePath);
		try {
			Font newFont = Util.subset(fontFile, subset);
			for (FileType type : types) {
				if (type == FileType.TTF) {
					File outputFile = new File(outputDir + "ttf.ttf");
					Util.saveAsTtf(outputFile, newFont);
				} else if (type == FileType.EOT) {
					File outputFile = new File(outputDir + "eot.eot");
					Util.saveAsEot(outputFile, newFont, false);
				} else if (type == FileType.WOFF) {
					File outputFile = new File(outputDir + "woff.woff");
					Util.saveAsWoff(outputFile, newFont);
				}
			}
		} catch (java.io.IOException e) {
			e.printStackTrace();
			throw new IOException(ExceptionType.IO, e.getMessage());
		}

	}

	@Override
	public String getFontInfo(String filePath) throws TException {
		try {
			Font font = FontUtils.getFonts(filePath)[0];
			DataDisplayTable table = FontInfo.listNameEntries(font);
			return table.csvString();
		} catch (java.io.IOException e) {
			e.printStackTrace();
			throw new IOException(ExceptionType.IO, e.getMessage());
		}
	}

}
